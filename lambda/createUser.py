import boto3
import json

dynamo = boto3.client('dynamodb')

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

    # Request parameters
    userName = payload['userName'] if 'userName' in payload else 'Some random guy'

    if 'Item' not in itemResult:
        dynamo.put_item(
            TableName=payload['TableName'],
            Item={
                'userId': {'S': payload['userId']},
                'userName': {'S': userName},
                'points': {'N': '0'},
                'underVote': {'N': '0'},
                'confirmed': {'BOOL': False}
            }
        )

    else:
        dynamo.update_item(
            TableName=payload['TableName'],
            Key={'userId': {'S': payload['userId']}},
            UpdateExpression='SET userName = :userName',
            ExpressionAttributeValues={
                ':userName': {'S': userName}
            }
        )

    return respond(None, 'OK')
