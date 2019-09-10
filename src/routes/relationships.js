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
    const rel = req.body.relationship;
    console.log('rel +'+rel)
    const pcId = req.body.pcId
    const pcId2 = req.body.pcId2

    if(campaign){
        models.Relationship.create({
            PcId: pcId,
            PcId2: pcId2,
            relationship: rel
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
    const npcId = req.body.npcId
    if(campaign){
        models.Relationship.create({
            PcId: pcId,
            NpcId: npcId,
            relationship: relationship
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
    const locationId = req.body.locationId
    if(campaign){
        models.Relationship.create({
            PcId: pcId,
            LocationId: locationId,
            relationship: relationship
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

router.post('/addNpcNpcRelationship', async (req,res) =>{
    const campaign = req.campaign;
    const relationship = req.body.relationship;
    const npcId = req.body.npcId
    const npcId2 = req.body.npcId2
    if(campaign){
        models.Relationship.create({
            NpcId: npcId,
            NpcId2: npcId2,
            relationship: relationship
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

router.post('/addNpcLocationRelationship', async (req,res) =>{
    const campaign = req.campaign;
    const relationship = req.body.relationship;
    const npcId = req.body.npcId
    const locationId = req.body.locationId
    if(campaign){
        models.Relationship.create({
            NpcId: npcId,
            LocationId: locationId,
            relationship: relationship
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

router.post('/addLocationLocationRelationship', async (req,res) =>{
    const campaign = req.campaign;
    const relationship = req.body.relationship;
    const locationId = req.body.locationId
    const locationId2 = req.body.locationId2
    if(campaign){
        models.Relationship.create({
            LocationId: locationId,
            LocationId2: locationId2,
            relationship: relationship
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