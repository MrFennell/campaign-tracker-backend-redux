const express = require('express');

const router = express.Router();
const models = require('../../models');
const multer = require('multer');

const uploadNpc = multer({
    dest: './public/images/npcs',
    limits: {
        fieldSize: 25 * 1024 * 1024
    },
    preservePath: false
})

router.get('/', async function (req,res){
    const campaign = await req.campaign;
    try{
        const npcs = await campaign.getNpcs();
        console.log('!!!!!!!!!!!!!!!!!!!!!'+npcs);
        if (npcs){
            res.json(npcs);
        }else{
            res.json('no npcs');
        }
    }catch(err){
        console.log(err);
    } 
});

router.post("/addNpcWithImage", uploadNpc.single('file'), async (req,res) => {
    const newName = req.body.name;
    const newRace = req.body.race;
    const newProfession = req.body.profession;    
    const newLifeState = req.body.lifeState;
    const newDescription = req.body.description;
    const newSharedBio = req.body.sharedBio;
    const newPrivateBio = req.body.privateBio;

    const fileDestination = req.file.destination;
    const fileName = req.file.filename;
    const slicedFileDestination = fileDestination.slice(8);
    const newImageSrc = slicedFileDestination + "/" + fileName;
    const campaignId = req.campaign.id
    const campaign = await models.Campaign.findByPk(campaignId);
    
    if (campaign) {
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
             .then(npc => {
                campaign.addNpc(npc)
            })
            .then (async function(){
                try{
                    let campaignId = req.campaign.id;
                    let campaign = await models.Campaign.findByPk(campaignId);                
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

router.post('/addNpc', uploadNpc.none(), async (req, res) => {
    const newName = req.body.name;
    const newRace = req.body.race;
    const newProfession = req.body.profession;    
    const newLifeState = req.body.lifeState;
    const newDescription = req.body.description;
    const newSharedBio = req.body.sharedBio;
    const newPrivateBio = req.body.privateBio;

    const campaignId = req.campaign.id;
    let campaign = await models.Campaign.findByPk(campaignId);

    if (campaign) {
        await models.Npc.create({
            name: newName, 
            race: newRace, 
            profession: newProfession,
            lifeState: newLifeState,
            description: newDescription,
            sharedBio: newSharedBio,
            privateBio: newPrivateBio,
        })

        .then(async function(npc){
            campaign.addNpc(npc);
        })

        .then (async function(){
            try{
                let campaignId = req.campaign.id;
                let campaign = await models.Campaign.findByPk(campaignId);                
                let npcs = await campaign.getNpcs();
                if (npcs){
                    res.json(npcs);
                }else{
                    console.log(err);
                }
            }catch(err){
                console.log(err);
            }
        });
    }
});

router.post('/updateNpc',  async (req, res) => {
    const npcId = req.body.id;
    const newName = req.body.name;
    const newRace = req.body.race;
    const newProfession = req.body.profession;    
    const newLifeState = req.body.lifeState;
    const newDescription = req.body.description;
    const newSharedBio = req.body.sharedBio;
    const newPrivateBio = req.body.privateBio;

    var thisNpc = await models.Npc.findByPk(npcId);
    
    if (thisNpc){
        await thisNpc.update({
                name: newName, 
                race: newRace, 
                profession: newProfession,
                lifeState: newLifeState,
                description: newDescription,
                sharedBio: newSharedBio,
                privateBio: newPrivateBio
            })
            .then (async function(){
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
    else{
        res.json('error');
    }
});

router.post('/updateNpcWithImage', uploadNpc.single('file'), async (req, res) => {
    const npcId = req.body.id;
    const newName = req.body.name;
    const newRace = req.body.race;
    const newProfession = req.body.profession;    
    const newLifeState = req.body.lifeState;
    const newDescription = req.body.description;
    const newSharedBio = req.body.sharedBio;
    const newPrivateBio = req.body.privateBio;

    const fileDestination = req.file.destination;

    const fileName = req.file.filename;

    const slicedFileDestination = fileDestination.slice(8);
    const newImageSrc = slicedFileDestination + "/" + fileName;

    var thisNpc = await models.Npc.findByPk(npcId);
    
    if (thisNpc){
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
            .then (async function(){
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
    else{
        res.json('error');
    }
});

router.post('/updateNpcImage', uploadNpc.single('file'), async (req, res) => {
    const npcId = req.body.NpcId;
    const oldImage = req.body.oldImage;
    const fileDestination = req.file.destination;
        
    const fileName = req.file.filename;
    const slicedFileDestination = fileDestination.slice(8);
    const newImageSrc = slicedFileDestination + "/" + fileName;
    let thisNpc = await models.Npc.findByPk(npcId);

    if (thisNpc){
        await thisNpc.update({
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

router.post('/deleteNpc', uploadNpc.none(), async (req, res) => {
    const npcId = req.body.id;
    let thisNpc = await models.Npc.findByPk(npcId);
    const oldImage = req.body.imageSrc;

    if (thisNpc){
        await thisNpc.destroy()

        .then(async function(){
            if (oldImage !== undefined && oldImage !== null){
                var fs= require ('fs');
                fs.unlinkSync('./public'+oldImage)
            }
        })
        .then (async function(){
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