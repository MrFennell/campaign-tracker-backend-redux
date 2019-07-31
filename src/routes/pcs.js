const express = require('express');

const router = express.Router();
const models = require('../../models');
const multer = require('multer');

const uploadPc = multer({
    dest: './public/images/pcs',
    limits: {
        fieldSize: 25 * 1024 * 1024
    },
    preservePath: false
})

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
    const fileDestination = req.file.destination;
    const fileName = req.file.filename;
    const slicedFileDestination = fileDestination.slice(8);
    const newPcImageSrc = slicedFileDestination + "/" + fileName;
    const campaignId = req.campaign.id
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
    let campaign = await models.Campaign.findByPk(campaignId);

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
    const fileDestination = req.file.destination;
    const fileName = req.file.filename;

    const slicedFileDestination = fileDestination.slice(8);
    const newPcImageSrc = slicedFileDestination + "/" + fileName;

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
    const fileDestination = req.file.destination;
    const fileName = req.file.filename;
    const slicedFileDestination = fileDestination.slice(8);
    const newPcImageSrc = slicedFileDestination + "/" + fileName;
    let thisPc = await models.Pc.findByPk(pcId);

    if (thisPc){

        await thisPc.update({
                imageSrc: newPcImageSrc
            })
            .then(async function(){
                console.log('old-image '+oldImage);
                if (oldImage !== undefined && oldImage !== null){
                    var fs= require ('fs');
                    fs.unlinkSync('./public'+oldImage)
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
    const thisPc = await models.Pc.findByPk(pcId);
    const oldImage = req.body.imageSrc;

    if (thisPc){
        await thisPc.destroy()

        .then(async function(){
            if (oldImage !== undefined && oldImage !== null){
                var fs= require ('fs');
                fs.unlinkSync('./public'+oldImage)
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
module.exports = router;