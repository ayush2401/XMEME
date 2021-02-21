chmod +x install.sh

sudo ./install.sh



chmod +x server_run.sh

./server_run.sh &



chmod +x sleep.sh

./sleep.sh


curl --location --request GET 'http://localhost:8081/memes'

curl --location --request POST 'http://localhost:8081/memes' \
--header 'Content-Type: application/json' \
--data-raw '{
"name": "xyz",
"url": "https://i.pinimg.com/originals/e0/21/28/e02128175ee90c9ce7a3e01aeecaed66.jpg",
"caption": "This is a meme"
}'

curl --location --request GET 'http://localhost:8081/memes'