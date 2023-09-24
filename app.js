// This code cleans up unused profile pictures from an S3 bucket.


// This package is used to create Express apps.
const express = require('express');

// This package is used to connect to MongoDB databases.
const MongoClient = require('mongodb').MongoClient;

// This package is used to interact with AWS services, such as S3
const AWS = require("aws-sdk")

// Create an Express app.
const app = express();

// This is the URL of the MongoDB database.
const url = 'mongodb://localhost:27017';

// Connect to the MongoDB database.
MongoClient.connect(url, (err, client) => {
    if (err) {
        console.log('Error while connecting mongo client: ', err)
        return;
    }

    console.log('Mongo client connected successfully');

    const db = client.db('test');
    const userCollection = db.collection('users');

    // Create an S3 client.
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'ap-south-1'
    })

    // GET /clean-profile-pivtures
    app.get('/clean-profile-pictures', async (req, res) => {

        // Get a list of all the image URLs in the S3 bucket.
        const imageUrls = await s3.listObjectsV2({
            Bucket: 'test-images',
            Prefix: 'profile/'
        }).promise().then(data => data.Contents.map(item => item.Key))

        // Get a list of all the image URLs that are currently being used as profile pictures.
        const usedImageUrls = await userCollection.find({
            imageUrl: { $in: imageUrls }
        }).toArray()

        // Get a list of all the image URLs that are not currently being used as profile pictures.
        const unUsedImageUrls = imageUrls.filter(url => !usedImageUrls.find(user => user.imageUrl === url))

        // Delete the unused image URLs from the S3 bucket.
        for (const imageUrl of unUsedImageUrls) {
            await s3.deleteObject({
                Bucket: 'test-images',
                Key: imageUrl
            }).promise()
        }

        res.send("profile pictures cleaned successfully")
    })
})

app.listen(3000, () => console.log('server started on port 3000'));