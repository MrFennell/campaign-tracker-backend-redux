const express = require('express');
const router = express.Router();
const models = require('../../models');

router.post('/addPcNpcRelationship', async (req,res) =>{

    const relationship = req.body.relationship;
    const pcId = req.body.pcId
    const pcName = req.body.pcName
    const pc = await models.Pc.findByPk(pcId);
    const npcId = req.body.npcId
    const npcName = req.body.npcName
    const npc = await models.Npc.findByPk(npcId);
    if(pc && npc){
        models.PcNpcRelationship.create({
            PcName: pcName,
            NpcName: npcName,
            Relationship: relationship
        }).then(function (relationshipModel) {
            pc.addPcNpcRelationship(relationshipModel)
            npc.addPcNpcRelationship(relationshipModel)
        })
        .then(async function(relationshipModel){
            const pcRelationships = await pc.getPcNpcRelationships(relationshipModel)
            res.json(pcRelationships)
        })
    }
});

router.post('/getPcNpcRelationship', async (req,res) =>{
    const pcId = req.body.pcId
    const pc = await models.Pc.findByPk(pcId);
    if(pc){
        const pcRelationships = await pc.getPcNpcRelationships()
        res.json(pcRelationships)
    }
});

router.post('/deletePcNpcRelationship', async (req,res) =>{
        const relationshipId = req.body.relationshipId
        const pcId = req.body.pcId
        const pc = await models.Pc.findByPk(pcId);
        let relationshipToBeDestroyed = await models.PcNpcRelationship.findByPk(relationshipId);
        await relationshipToBeDestroyed.destroy()
        .then(async function(){
            const pcRelationships = await pc.getPcNpcRelationships()
            res.json(pcRelationships)
        })
});












module.exports = router;