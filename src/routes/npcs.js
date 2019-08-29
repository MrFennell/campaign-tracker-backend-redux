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
            cb(null, 'npcs/'+dateNow+file.originalname);
        }
    })
});

router.get('/', async function (req,res){
    const campaign = await req.campaign;
    try{
        const npcs = await campaign.getNpcs();
        if (npcs){
            res.json(npcs);
        }else{
            res.json('no npcs');
        }
    }catch(err){
        console.log(err);
    } 
});

router.post("/addNpc", upload.any(), async (req,res) => {
    const newName = req.body.name;
    const newRace = req.body.race;
    const newProfession = req.body.profession;    
    const newLifeState = req.body.lifeState;
    const newDescription = req.body.description;
    const newSharedBio = req.body.sharedBio;
    const newPrivateBio = req.body.privateBio;
    const campaignId = req.campaign.id
    const campaign = await models.Campaign.findByPk(campaignId);
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
       await models.Npc.create({
            name: newName, 
            race: newRace, 
            profession: newProfession,
            lifeState: newLifeState,
            description: newDescription,
            sharedBio: newSharedBio,
            privateBio: newPrivateBio,
            imageSrc: newImageSrc
            })
             .then(function (npc)  {
                return campaign.addNpc(npc)
            })
            .then (async function(){
                try{
                    // let campaignId = req.campaign.id;
                    // let campaign = await models.Campaign.findByPk(campaignId);                
                    let pcs = await campaign.getNpcs();
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

router.post('/updateNpc', upload.any(), async (req, res) => {
    const npcId = req.body.npcId;
    const newName = req.body.name;
    const newRace = req.body.race;
    const newProfession = req.body.profession;    
    const newLifeState = req.body.lifeState;
    const newDescription = req.body.description;
    const newSharedBio = req.body.sharedBio;
    const newPrivateBio = req.body.privateBio;
    const oldImage = req.body.oldImage;
    let thisNpc = await models.Npc.findByPk(npcId);
    let newImageSrc = oldImage;
    const newImageSrcLookup = new Promise((resolve, reject) => {
        if (req.files){
            filename = dateNow+req.files[0].originalname;
             resolve(filename);
        }
        else{reject('')}
    })
    if (thisNpc){
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
        await thisNpc.update({
            name: newName, 
            race: newRace, 
            profession: newProfession,
            lifeState: newLifeState,
            description: newDescription,
            sharedBio: newSharedBio,
            privateBio: newPrivateBio,
            imageSrc: newImageSrc
        })
        .then(function(){
            if (oldImage !== undefined && oldImage !== null){
                const s3 = new aws.S3()
                s3.deleteObject({
                    Bucket: Bucket,
                    Key: 'npcs/'+oldImage
                },
                function (err,data){})
            }
        })
        .then (async function(){
            const campaign = await req.campaign;
            try{
                const npcs = await campaign.getNpcs();
                if (npcs){
                    res.json(npcs);
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


router.post('/updateNpcImage', upload.single('file'), async (req, res) => {
    const npcId = req.body.npcId;
    const oldImage = req.body.oldImage;
    const newImageSrc = dateNow + req.file.originalname
    let thisNpc = await models.Npc.findByPk(npcId);
    if (thisNpc){
        await thisNpc.update({
            imageSrc: newImageSrc
        })
        .then(async function(){
            if (oldImage !== undefined && oldImage !== null){
                const s3 = new aws.S3()
                s3.deleteObject({
                    Bucket: Bucket,
                    Key: 'npcs/'+oldImage
                },
                function (err,data){})
            }
        })
        .then (async function(){
            const campaign = await req.campaign;
            try{
                const npcs = await campaign.getNpcs();
                if (npcs){
                    res.json(npcs);
                }else{
                    res.json('error');
                }
            }catch(err){
                console.log(err);
            } 
        });
    }
});

router.post('/deleteNpc', upload.none(), async (req, res) => {
    const npcId = req.body.id;
    let thisNpc = await models.Npc.findByPk(npcId);
    const oldImage = req.body.imageSrc;
    if (thisNpc){
        await thisNpc.destroy()
        .then(async function(){
            if (oldImage !== undefined && oldImage !== null){
                const s3 = new aws.S3()
                s3.deleteObject({
                    Bucket: Bucket,
                    Key: 'npcs/'+oldImage
                },
                function (err,data){})
            }
        }).then (async function(){
            const campaign = await req.campaign;
            try{
                const pcs = await campaign.getNpcs();
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