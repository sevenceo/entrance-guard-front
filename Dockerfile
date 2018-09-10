FROM nginx:1.12

# Add OpenSSH
# RUN apk update && apk add openssh


# add directly the jar
ADD dist /usr/share/nginx/html/

EXPOSE 80
