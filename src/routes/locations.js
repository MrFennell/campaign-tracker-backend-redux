const express = require('express');
const router = express.Router();
const models = require('../../models');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const dateNow = Date.now() //date used for unique image id
const Bucket = process.env.AWS_BUCKET_NAME
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
});
const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: Bucket,
        key: function (req, file, cb) {
            console.log(file);
            console.log(dateNow);
            cb(null, 'locations/'+dateNow+file.originalname);
        }
    })
});

router.get('/', async function (req,res){
    const campaign = await req.campaign;
    try{
        const locations = await campaign.getLocations();
        if (locations){
            res.json(locations);
        }else{
            res.json('no locations');
        }
    }catch(err){
        console.log(err);
    } 
});

router.post('/addLocation', upload.any(), async (req, res) => {
    const newName = req.body.name;
    const newRegion = req.body.region;

    const campaignId = req.campaign.id;
    let campaign = await models.Campaign.findByPk(campaignId);
    let newImageSrc = '';
    const newImageSrcLookup = new Promise((resolve, reject) => {
        if (req.files){
             let filename = dateNow+req.files[0].originalname;
             resolve(filename);
        }
        else{reject('')}
    })

    if (campaign) {
        const checkSrc = () => {
            newImageSrcLookup
            .then(function(file){
                newImageSrc = file;
            })
            .catch(function(){
                'no changes'
            })
        }
       await checkSrc();	

        await models.Location.create({
            name: newName, 
            region: newRegion,
            imageSrc: newImageSrc
        })
        .then(function (location)  {
            return campaign.addLocation(location)
        })
        .then (async function(){
            try{
                let campaignId = req.campaign.id;
                let campaign = await models.Campaign.findByPk(campaignId);                
                let locations = await campaign.getLocations();
                if (locations){
                    res.json(locations);
                }else{
                    console.log(err);
                }
            }catch(err){
                console.log(err);
            }
        });
    }
});

router.post('/updateLocation', upload.any(), async (req, res) => {
    const locationId = req.body.locationId;
    const newName = req.body.name;
    const newRegion = req.body.region;
    const oldImage = req.body.oldImage;
    var thisLocation = await models.Location.findByPk(locationId);
    let filename = ''
    let newImageSrc = oldImage;
    const newImageSrcLookup = new Promise((resolve, reject) => {
        if (req.files){
            filename = dateNow+req.files[0].originalname;
             resolve(filename);
        }
        else{reject('')}
    })

    if (thisLocation){
        const checkSrc = function () { //check if new image is present, if not assign old image
            newImageSrcLookup
            .then(function(file){
                newImageSrc = file;
            })
            .catch(function(){
                'no changes'
            })
        }
        await checkSrc();
        await thisLocation.update({
                name: newName, 
                region: newRegion, 
                imageSrc: newImageSrc
            })
            .then(async function(){
                if (oldImage !== undefined && oldImage !== null){
                    const s3 = new aws.S3()
                    s3.deleteObject({
                        Bucket: Bucket,
                        Key: 'locations/'+oldImage
                    },
                    function (err,data){})
                }
            })
            .then (async function(){
                const campaign = await req.campaign;
                try{
                    const locations = await campaign.getLocations();
                    if (locations){
                        res.json(locations);
                    }else{
                        res.json('error');
                    }
                }catch(err){
                    console.log(err);
                } 

            });
    }
    else{
        res.json('error-outer');
    }
});

router.post('/updateLocationImage', upload.single('file'), async (req, res) => {
    const locationId = req.body.LocationId;
    const oldImage = req.body.oldImage;
    const fileDestination = req.file.destination;
        
    const fileName = req.file.filename;
    const slicedFileDestination = fileDestination.slice(8);
    const newImageSrc = slicedFileDestination + "/" + fileName;
    let thisLocation = await models.Location.findByPk(locationId);

    if (thisLocation){
        await thisLocation.update({
                imageSrc: newImageSrc
            })
            .then(async function(){
                if (oldImage !== undefined && oldImage !== null){
                    var fs= require ('fs');
                    fs.unlinkSync('./public'+oldImage)
                }
            })
            .then (async function(){
                const campaign = await req.campaign;
                try{
                    const locations = await campaign.getLocations();
                    if (locations){
                        res.json(locations);
                    }else{
                        res.json('error');
                    }
                }catch(err){
                    console.log(err);
                } 
            });
    }
});

router.post('/deleteLocation', upload.none(), async (req, res) => {
    const locationId = req.body.id;
    let thisLocation = await models.Location.findByPk(locationId);
    const oldImage = req.body.imageSrc;

    if (thisLocation){
        await thisLocation.destroy()
        .then(async function(){
            if (oldImage !== undefined && oldImage !== null){
                const s3 = new aws.S3()
                s3.deleteObject({
                    Bucket: Bucket,
                    Key: 'locations/'+oldImage
                },
                function (err,data){})
            }
         })
        .then (async function(){
            const campaign = await req.campaign;
            try{
                const locations = await campaign.getLocations();
                if (locations){
                    res.json(locations);
                }else{
                    res.json('error');
                }
            }catch(err){
                console.log(err);
            } 

        });
    }
});
module.exports = router;