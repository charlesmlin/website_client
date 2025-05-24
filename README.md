# Local run
To run client locally, do:

```
npm run dev
```

# Build
To build docker image, run:

```
docker build -t website_client .
```

To test docker image, run:

```
docker run --env-file .env -p 5000:80 website_client
```

To kill docker image, run:

```
docker ps
docker rm -f $(docker ps | grep 5000 | awk '{print $1}')
```

To tag and push image into AWS ECR, run:

```
aws ecr get-login-password | docker login --username AWS --password-stdin 048283574717.dkr.ecr.eu-west-2.amazonaws.com
docker tag website_client:latest 048283574717.dkr.ecr.eu-west-2.amazonaws.com/personal_website/client:latest
docker push 048283574717.dkr.ecr.eu-west-2.amazonaws.com/personal_website/client:latest
```

# Technical detail
Icon Font: Kdam Thmor Pro (#FFA & #4285F4)