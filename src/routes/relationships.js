const express = require('express');
const router = express.Router();
const models = require('../../models');

router.get('/', async function (req,res){
    const campaign = await req.campaign;
    try{
        const relationships = await campaign.getRelationships();
        if (relationships){
            res.json(relationships);
        }else{
            res.json('');
        }
    }catch(err){
        console.log(err);
    } 
});
router.post('/addPcPcRelationship', async (req,res) =>{
    const campaign = req.campaign;
    const relationship = req.body.relationship;
    const pcId = req.body.pcId
    const pcName = req.body.pcName
    const pcId2 = req.body.pcId2
    const pcName2 = req.body.pcName2
    if(campaign){
        models.Relationship.create({
            PcId: pcId,
            PcId2: pcId2,
            PcName: pcName,
            PcName2: pcName2,
            Relationship: relationship
        })
        .then(function (relationshipModel) {
            try{
                campaign.addRelationship(relationshipModel)
            }catch(err){
                console.log(err);
            }
        }).then(async function(){
            try{
                let campaignId = req.campaign.id;
                let campaign = await models.Campaign.findByPk(campaignId); 
                const rel = await campaign.getRelationships()
                res.json(rel);
            }catch(err){
                console.log(err);
            }
           
        })
    }
});

router.post('/addPcNpcRelationship', async (req,res) =>{
    const campaign = req.campaign;
    const relationship = req.body.relationship;
    const pcId = req.body.pcId
    const pcName = req.body.pcName
    const npcId = req.body.npcId
    const npcName = req.body.npcName
    if(campaign){
        models.Relationship.create({
            PcId: pcId,
            NpcId: npcId,
            PcName: pcName,
            NpcName: npcName,
            Relationship: relationship
        })
        .then(function (relationshipModel) {
            try{
                campaign.addRelationship(relationshipModel)
            }catch(err){
                console.log(err);
            }
        }).then(async function(){
            try{
                let campaignId = req.campaign.id;
                let campaign = await models.Campaign.findByPk(campaignId); 
                const rel = await campaign.getRelationships()
                res.json(rel);
            }catch(err){
                console.log(err);
            }
           
        })
    }
});


router.post('/addPcLocationRelationship', async (req,res) =>{
    const campaign = req.campaign;
    const relationship = req.body.relationship;
    const pcId = req.body.pcId
    const pcName = req.body.pcName
    const locationId = req.body.locationId
    const locationName = req.body.locationName
    if(campaign){
        models.Relationship.create({
            PcId: pcId,
            LocationId: locationId,
            PcName: pcName,
            LocationName: locationName,
            Relationship: relationship
        })
        .then(function (relationshipModel) {
            try{
                campaign.addRelationship(relationshipModel)
            }catch(err){
                console.log(err);
            }
        }).then(async function(){
            try{
                let campaignId = req.campaign.id;
                let campaign = await models.Campaign.findByPk(campaignId); 
                const rel = await campaign.getRelationships()
                res.json(rel);
            }catch(err){
                console.log(err);
            }
           
        })
    }
});

router.post('/deleteRelationship', async (req,res) =>{
        const relationshipId = req.body.relationshipId
        const relationship = await models.Relationship.findByPk(relationshipId);
        await relationship.destroy()
        .then(async function(){
            let campaignId = req.campaign.id;
            let campaign = await models.Campaign.findByPk(campaignId); 
            const rel = await campaign.getRelationships()
            res.json(rel)
        })
});


module.exports = router;