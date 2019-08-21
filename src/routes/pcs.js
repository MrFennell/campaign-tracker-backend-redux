const express = require('express');
const router = express.Router();
const models = require('../../models');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const fs = require('fs')
const dateNow = Date.now() //date used for unique image id
const Bucket = process.env.AWS_BUCKET_NAME

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
});


const s3 = new aws.S3();

const uploadPc = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'campaign-tracker',
        key: function (req, file, cb) {
            console.log(file);
            console.log(dateNow);
            cb(null, 'pcs/'+dateNow+file.originalname);
        }
    })
});

router.get('/', async function (req,res){
    const campaign = await req.campaign;
    try{
        const pcs = await campaign.getPcs();
        if (pcs){
            res.json(pcs);
        }else{
            res.json('no pcs');
        }
    }catch(err){
        console.log(err);
    } 
});
router.post("/addPcWithImage", uploadPc.single('file'), async (req,res) => {

    const newPcName = req.body.pcName;
    const newPcClass = req.body.pcClass;
    const newPlayerName = req.body.playerName;
    const newPcRace = req.body.pcRace;
    const newPcLevel = req.body.pcLevel;
    const newPcLifestate = req.body.pcLifestate;
    const newPcSharedBio = req.body.pcSharedBio;
    const newPcPrivateBio = req.body.pcPrivateBio;
    const newPcDescription = req.body.pcDescription;
    const campaignId = req.campaign.id
    const campaign = await models.Campaign.findByPk(campaignId);
    const newPcImageSrc = dateNow + req.file.originalname
    
    if (campaign) {
       await models.Pc.create({
            pcName: newPcName, 
            pcClass: newPcClass,
            playerName: newPlayerName,
            pcRace: newPcRace,
            pcLevel: newPcLevel,
            pcLifestate: newPcLifestate,
            pcSharedBio: newPcSharedBio,
            pcPrivateBio: newPcPrivateBio,
            pcDescription: newPcDescription,
            imageSrc: newPcImageSrc
            })
             .then(pc => {
                campaign.addPc(pc)
            })
            .then (async function(){
                try{
                    let campaignId = req.campaign.id;
                    let campaign = await models.Campaign.findByPk(campaignId);                
                    let pcs = await campaign.getPcs();
                    if (pcs){
                        res.json(pcs);
                    }else{
                        res.json('no pcs');
                    }
                }catch(err){
                    console.log(err);
                } 
            });
        }
});

router.post('/addPc', uploadPc.none(), async (req, res) => {
    const newPcName = req.body.pcName;
    const newPcClass = req.body.pcClass;
    const newPlayerName = req.body.playerName;
    const newPcRace = req.body.pcRace;
    const newPcLevel = req.body.pcLevel;
    const newPcLifestate = req.body.pcLifestate;
    const newPcSharedBio = req.body.pcSharedBio;
    const newPcPrivateBio = req.body.pcPrivateBio;
    const newPcDescription = req.body.pcDescription;
    const campaignId = req.campaign.id;
    const campaign = await models.Campaign.findByPk(campaignId);

    if (campaign) {
        await models.Pc.create({
            pcName: newPcName, 
            pcClass: newPcClass, 
            playerName: newPlayerName,
            pcRace: newPcRace,
            pcLevel: newPcLevel,
            pcLifestate: newPcLifestate,
            pcSharedBio: newPcSharedBio,
            pcPrivateBio: newPcPrivateBio,
            pcDescription: newPcDescription
        })

        .then(async function(pc){
            campaign.addPc(pc);
        })
        
        .then (async function(){
            try{
                let campaignId = req.campaign.id;
                let campaign = await models.Campaign.findByPk(campaignId);                
                let pcs = await campaign.getPcs();
                if (pcs){
                    res.json(pcs);
                }else{
                    res.json('no pcs');
                }
            }catch(err){
                console.log(err);
            } 
        });
    }
});

router.post('/updatePc',  async (req, res) => {
    const pcId = req.body.id;
    const newPcName = req.body.pcName;
    const newPcClass = req.body.pcClass;
    const newPlayerName = req.body.playerName;
    const newPcRace = req.body.pcRace;
    const newPcLevel = req.body.pcLevel;
    const newPcLifestate = req.body.pcLifestate;
    const newPcSharedBio = req.body.pcSharedBio;
    const newPcPrivateBio = req.body.pcPrivateBio;

    const newPcDescription = req.body.pcDescription;
    
    var thisPc = await models.Pc.findByPk(pcId);
    
    if (thisPc){
        await thisPc.update({
                pcName: newPcName, 
                pcClass: newPcClass, 
                playerName: newPlayerName,
                pcRace: newPcRace,
                pcLevel: newPcLevel,
                pcLifestate: newPcLifestate,
                pcSharedBio: newPcSharedBio,
                pcPrivateBio: newPcPrivateBio,
                pcDescription: newPcDescription
            })
           
            .then (async function(){
                const campaign = await req.campaign;
                try{
                    const pcs = await campaign.getPcs();
                    if (pcs){
                        res.json(pcs);
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

router.post('/updatePcWithImage', uploadPc.single('file'), async (req, res) => {
    const pcId = req.body.id;
    const newPcName = req.body.pcName;
    const newPcClass = req.body.pcClass;
    const newPlayerName = req.body.playerName;
    const newPcRace = req.body.pcRace;
    const newPcLevel = req.body.pcLevel;
    const newPcLifestate = req.body.pcLifestate;
    const newPcSharedBio = req.body.pcSharedBio;
    const newPcPrivateBio = req.body.pcPrivateBio;
    const newPcDescription = req.body.pcDescription;
    const oldImage = req.body.oldImage;
    const newPcImageSrc = dateNow + req.file.originalname
    var thisPc = await models.Pc.findByPk(pcId);
    
    if (thisPc){
        await thisPc.update({
                pcName: newPcName, 
                pcClass: newPcClass, 
                playerName: newPlayerName,
                pcRace: newPcRace,
                pcLevel: newPcLevel,
                pcLifestate: newPcLifestate,
                pcSharedBio: newPcSharedBio,
                pcPrivateBio: newPcPrivateBio,
                pcDescription: newPcDescription,
                imageSrc: newPcImageSrc
            })
            .then(async function(){
                if (oldImage !== undefined && oldImage !== null){
                    const s3 = new aws.S3()
                    s3.deleteObject({
                        Bucket: Bucket,
                        Key: 'pcs/'+oldImage
                    },
                    function (err,data){})
                }
            })
            .then (async function(){
                const campaign = await req.campaign;
                try{
                    const pcs = await campaign.getPcs();
                    if (pcs){
                        res.json(pcs);
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

router.post('/updatePcImage', uploadPc.single('file'), async (req, res) => {
    const pcId = req.body.PcId;
    const oldImage = req.body.oldImage;
   
    const newPcImageSrc = dateNow + req.file.originalname
   
    const thisPc = await models.Pc.findByPk(pcId);
    if (thisPc){
        await thisPc.update({
                imageSrc: newPcImageSrc
            })
            .then(async function(){
                if (oldImage !== undefined && oldImage !== null){
                    const s3 = new aws.S3()
                    s3.deleteObject({
                        Bucket: Bucket,
                        Key: 'pcs/'+oldImage
                    },
                    function (err,data){})
                }
            })
            .then (async function(){
                const campaign = await req.campaign;
                try{
                    const pcs = await campaign.getPcs();
                    if (pcs){
                        res.json(pcs);
                    }else{
                        res.json('error');
                    }
                }catch(err){
                    console.log(err);
                } 
            });
    }
});

router.post('/deletePc', uploadPc.none(), async (req, res) => {
    const pcId = req.body.id;
    let thisPc = await models.Pc.findByPk(pcId);
    const oldImage = req.body.imageSrc;
    if (thisPc){
        await thisPc.destroy()
        .then(async function(){
            if (oldImage !== undefined && oldImage !== null){
                    const s3 = new aws.S3()
                    s3.deleteObject({
                        Bucket: 'campaign-tracker',
                        Key: 'pcs/'+oldImage
                    },
                    function (err,data){})
            }
        }).then (async function(){
            const campaign = await req.campaign;
            try{
                const pcs = await campaign.getPcs();
                if (pcs){
                    res.json(pcs);
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