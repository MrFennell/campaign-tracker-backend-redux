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
router.post("/addPc", upload.any(), async (req,res) => {
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
            newImageSrcLookup.then(function(file){
                newImageSrc = file;
            }),(blank) => {newImageSrc = blank}
        }
       await checkSrc();

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
            imageSrc: newImageSrc
            })
             .then(function (pc) {
               return campaign.addPc(pc)
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


router.post('/updatePc', upload.any(), async (req, res) => {
    const pcId = req.body.pcId;
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
    let thisPc = await models.Pc.findByPk(pcId);
    let filename = ''
    let newImageSrc = oldImage;
    const newImageSrcLookup = new Promise((resolve, reject) => {
        if (req.files){
            filename = dateNow+req.files[0].originalname;
             resolve(filename);
        }
        else{reject('')}
    })

    if (thisPc){
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
                imageSrc: newImageSrc
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

router.post('/updatePcImage', upload.single('file'), async (req, res) => {
    const pcId = req.body.PcId;
    const oldImage = req.body.oldImage;
    const newImageSrc = dateNow + req.file.originalname
    const thisPc = await models.Pc.findByPk(pcId);
    if (thisPc){
        await thisPc.update({
                imageSrc: newImageSrc
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

router.post('/deletePc', upload.none(), async (req, res) => {
    const pcId = req.body.id;
    let thisPc = await models.Pc.findByPk(pcId);
    const oldImage = req.body.imageSrc;
    if (thisPc){
        await thisPc.destroy()
        .then(async function(){
            if (oldImage !== undefined && oldImage !== null){
                const s3 = new aws.S3()
                s3.deleteObject({
                    Bucket: Bucket,
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