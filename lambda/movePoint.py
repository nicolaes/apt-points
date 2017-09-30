import boto3
import json

print('Loading function')
dynamo = boto3.client('dynamodb')

VOUCHES_PER_POINT = 3


def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': json.dumps(str(err) if err else res),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


def lambda_handler(event, context):
    operation = event['httpMethod']
    if operation != 'GET':
        return respond(ValueError('Unsupported method "{}"'.format(operation)))

    payload = event['queryStringParameters']
    itemResult = dynamo.get_item(TableName=payload['TableName'], Key={'userId': {'S': payload['userId']}})
    if 'Item' not in itemResult:
        return respond(ValueError('UserId not found'))

    # Existing data
    item = itemResult['Item']
    userPoints = int(item['points']['N'])
    userUnderVote = int(item['underVote']['N'])
    userVouchers = item['vouchers']['SS'] if 'vouchers' in item else []

    # Request parameters
    voteDirection = -1 if 'direction' in payload and payload['direction'] == 'down' else 1
    isVouching = True if 'vouching' in payload and payload['vouching'] == '1' else False

    # Current user ID
    sub = event['requestContext']['authorizer']['claims']['sub']

    # Initiate vote / vouch vote process
    updateExpr = ''
    attrValues = {}
    if not isVouching:
        # Cancel if any vouching is in progress
        if userUnderVote != 0:
            return respond('Deja se voteaza')

        # Can't drop below 0
        if voteDirection == -1 and userPoints == 0:
            return respond('Nicio bila de sters')

        # Can't get more than 3 points
        if voteDirection == 1 and userPoints == 3:
            return respond('Are deja 3 bile, hai sa eliminam din ele inainte de altceva')

        # Start the vouching process & add me to the vouchers list
        (updateExpr, attrValues) = start_vote(sub, voteDirection)

    else:
        # Cancel if there are no vouches
        if userUnderVote == 0:
            return respond('Nu se mai voteaza')

        # Clear underVote and vouchers if there is a pending point in the opposite direction
        existingVoteDirection = userUnderVote / abs(userUnderVote)
        if existingVoteDirection != voteDirection:
            (updateExpr, attrValues) = empty_vote()

        else:
            # Can not vote twice
            if sub in userVouchers:
                return respond('Deja ai votat')

            # If there are enough vouches, update the points
            if abs(userUnderVote + voteDirection) >= VOUCHES_PER_POINT:
                (updateExpr, attrValues) = update_points(newPoints=userPoints + voteDirection)

            # Otherwise update the underVote and add me to vouchers
            else:
                (updateExpr, attrValues) = vote_point(sub, voteDirection)

    # Execute query
    if updateExpr != '':
        dynamo.update_item(
            TableName=payload['TableName'],
            Key={'userId': {'S': payload['userId']}},
            UpdateExpression=updateExpr,
            ExpressionAttributeValues=attrValues
        )

    return respond(None, 'OK')


def empty_vote():
    updateExpr = 'SET underVote = :zero REMOVE vouchers'
    attrValues = {
        ':zero': {'N': '0'}
    }
    return updateExpr, attrValues


def start_vote(sub, voteDirection):
    updateExpr = 'SET underVote = :direction, vouchers = :sub'
    attrValues = {
        ':direction': {'N': str(voteDirection)},
        ':sub': {'SS': [sub]}
    }
    return updateExpr, attrValues


def vote_point(sub, voteDirection):
    updateExpr = 'ADD underVote :voteDirection, vouchers :sub'
    attrValues = {
        ':voteDirection': {'N': str(voteDirection)},
        ':sub': {'SS': [sub]}
    }
    return updateExpr, attrValues


def update_points(newPoints):
    updateExpr = 'SET points = :points, underVote = :zero REMOVE vouchers'
    attrValues = {
        ':points': {'N': str(newPoints)},
        ':zero': {'N': '0'}
    }
    return updateExpr, attrValues
