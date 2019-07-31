const express = require('express');

const router = express.Router();
const models = require('../../models');
const multer = require('multer');

const uploadLocation = multer({
    dest: './public/images/locations',
    limits: {
        fieldSize: 25 * 1024 * 1024
    },
    preservePath: false
})

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

router.post("/addLocationWithImage", uploadLocation.single('file'), async (req,res) => {
    const newName = req.body.name;
    const newRegion = req.body.region;

    const fileDestination = req.file.destination;
    const fileName = req.file.filename;
    const slicedFileDestination = fileDestination.slice(8);
    const newImageSrc = slicedFileDestination + "/" + fileName;
    const campaignId = req.campaign.id
    const campaign = await models.Campaign.findByPk(campaignId);
    
    if (campaign) {
       await models.Location.create({
            name: newName, 
            region: newRegion, 
            imageSrc: newImageSrc
            })
             .then(location => {
                campaign.addLocation(location)
            })
            .then (async function(){
                try{
                    let campaignId = req.campaign.id;
                    let campaign = await models.Campaign.findByPk(campaignId);                
                    let locations = await campaign.getLocations();
                    if (locations){
                        res.json(locations);
                    }else{
                        res.json('no locations');
                    }
                }catch(err){
                    console.log(err);
                } 
            });
        }
});

router.post('/addLocation', uploadLocation.none(), async (req, res) => {
    const newName = req.body.name;
    const newRegion = req.body.region;

    const campaignId = req.campaign.id;
    let campaign = await models.Campaign.findByPk(campaignId);

    if (campaign) {
        await models.Location.create({
            name: newName, 
            region: newRegion, 
        })

        .then(async function(location){
            campaign.addLocation(location);
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

router.post('/updateLocation',  async (req, res) => {
    const locationId = req.body.id;
    const newName = req.body.name;
    const newRegion = req.body.region;

    var thisLocation = await models.Location.findByPk(locationId);
    
    if (thisLocation){
        await thisLocation.update({
                name: newName, 
                region: newRegion, 
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
        res.json('error');
    }
});

router.post('/updateLocationWithImage', uploadLocation.single('file'), async (req, res) => {
    const locationId = req.body.id;
    const newName = req.body.name;
    const newRegion = req.body.region;

    const fileDestination = req.file.destination;

    const fileName = req.file.filename;

    const slicedFileDestination = fileDestination.slice(8);
    const newImageSrc = slicedFileDestination + "/" + fileName;

    var thisLocation = await models.Location.findByPk(locationId);
    
    if (thisLocation){
        await thisLocation.update({
                name: newName, 
                region: newRegion, 
                imageSrc: newImageSrc
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
        res.json('error');
    }
});

router.post('/updateLocationImage', uploadLocation.single('file'), async (req, res) => {
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

router.post('/deleteLocation', uploadLocation.none(), async (req, res) => {
    const locationId = req.body.id;
    let thisLocation = await models.Location.findByPk(locationId);
    const oldImage = req.body.imageSrc;

    if (thisLocation){
        await thisLocation.destroy()

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
module.exports = router;