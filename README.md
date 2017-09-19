APT points app, based on Cognito Quickstart
===================================================

## Getting the code and running it locally
_This uses the pre-configured AWS resources hosted by AWS_

```
# Clone it from github
git clone --depth 1 git@github.com:nicolaes/apt-points.git
```
```
# Install the NPM packages
cd apt-points
npm install
```
```
# Run the app in dev mode
npm start
```

### _S3_
```
# Test your deployed application
curl –I http://[BUCKET_NAME].s3-website.[REGION].amazonaws.com/
```
