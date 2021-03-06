const express = require('express');
const path = require('path');
const router = express.Router();
const models = require('../../models');
const aws = require('aws-sdk');
const Bucket = process.env.AWS_BUCKET_NAME
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
});
// router.get('/', async function(req, res){
//     res.json(index);
// });

router.use('/static', express.static(path.join(__dirname,"/dist/"))); 
router.get('/', function(req,res) {
    res.sendFile('index.html', { root: path.join(__dirname, '/dist/') });
 });

router.post('/addCampaign', async (req, res) => {
    const cTitle = req.body.title;
    const cDescription = req.body.description;
    const userId = req.user.id;
    const thisUser = await models.User.findByPk(userId);
    try {
        models.Campaign.create({
            title: cTitle, 
            description: cDescription,
        }).then(campaign => {
            thisUser.addCampaign(campaign, {through: {role: "GM"}})
        }).then(async function(){
            try{
                let campaigns = await thisUser.getCampaigns();
                res.json(campaigns);
            }catch(err){
                console.log(err);
                return(err)
            } 
        });

    }catch(error){
        console.error(error);
    }
});

router.post('/setCurrentCampaign', async function (req, res) {
    req.session.campaign_id = req.body.id;
    let campaign = req.body;
    console.log(campaign);
    req.session.save(function() {
        res.json(campaign);
    })
});

router.get('/loadCurrentCampaign', async function (req, res){
    
    if (req.campaign){
        res.json(req.campaign);
    } else {
        res.json('');
    }
});

router.get('/campaigns', async function (req,res){
    const user = req.user;
    if (user){
        try{
            const campaigns = await user.getCampaigns();
            res.json(campaigns);
        }catch(err){
            console.log(err);
            return(err)
        }
    }
    else{
        res.json('');
    }
})

router.get('/campaignThumbnails', async function (req,res){
    const user = req.user;
    if (user){
        try{
            const campaigns = await user.getCampaigns();
            if (campaigns){
                let obj = {};
                let urls = [];
                let campaignList = [];
                let imageUrl = ''
                for  (let i = 0; i < campaigns.length; i++){
                    try{
                        const pcs = await campaigns[i].getPcs();
                        for (let i = 0; i < pcs.length; i++){
                            imageUrl = pcs[i].imageSrc;
                            urls.push(imageUrl);
                        }
                        obj.Role = campaigns[i].UserCampaign.role;
                        obj.id = campaigns[i].id;
                        obj.title = campaigns[i].title;
                        obj.description = campaigns[i].description;
                        obj.thumbnails = urls;
                        campaignList.push(obj);
                        obj = {}
                        urls = []
                    }catch(err){
                        console.log(err);
                        return(err)
                    }
                }
                // res.json(urls);
                res.json(campaignList);

            }
        }catch(err){
            console.log(err);
            return(err)
        }
    }
    else{
        res.json('');
    }
})

router.post('/updateCampaign',  async (req, res) => {
    const campaignId = req.body.id;
    const newCampaignTitle = req.body.title;
    const newCampaignDesc = req.body.description;
    const thisCampaign = await models.Campaign.findByPk(campaignId);
    if (thisCampaign){
        
        await thisCampaign.update({
                title: newCampaignTitle, 
                description: newCampaignDesc, 
                
            })
            .then(async function(){ 
                const user = req.user;
                let campaigns = await user.getCampaigns();
                res.json(campaigns);

            });
        
    }
    else{
        res.json('error');
    }
});

router.post('/deleteCampaign', async (req, res) => {
    const campaignId = req.body.id;
    const thisCampaign = await models.Campaign.findByPk(campaignId);
    const user = req.user;
    if (thisCampaign){

        //delete all PC images
        try{
            const pcs = await thisCampaign.getPcs();
            if (pcs){
                const pcLength = pcs.length;
                for ( i = 0; i <= pcLength; i++){
                    let pc = pcs[i];
                    let image = pc.imageSrc;
                    if (image!== undefined && image!== null){
                        const s3 = new aws.S3()
                        s3.deleteObject({
                            Bucket: Bucket,
                            Key: 'pcs/'+image
                        },
                        function (err,data){})
                    }
                }
            }
        }catch(err){
            console.log(err);
        }

        //delete all NPC images
        try{
            const npcs = await thisCampaign.getNpcs();
            if (npcs){
                const npcLength = npcs.length;
                for ( i = 0; i <= npcLength; i++){
                    let npc = npcs[i];
                    let image = npc.imageSrc;
                    if (image!== undefined && image!== null){
                        const s3 = new aws.S3()
                        s3.deleteObject({
                            Bucket: Bucket,
                            Key: 'npcs/'+image
                        },
                        function (err,data){})
                    }
                }
            }
        }catch(err){
            console.log(err);
        }
        
        //delete all Location images
        try{
            const locations = await thisCampaign.getLocations();
            if (locations){
                const locationLength = locations.length;
                for ( i = 0; i <= locationLength; i++){
                    let location = locations[i];
                    let image = location.imageSrc;
                    if (image!== undefined && image!== null){
                        const s3 = new aws.S3()
                        s3.deleteObject({
                            Bucket: Bucket,
                            Key: 'locations/'+image
                        },
                        function (err,data){})
                    }
                }
            }
        }catch(err){
            console.log(err);
        }
                
       try{
            await thisCampaign.destroy()
            .then(async function(){
                let campaigns = await user.getCampaigns();
                res.json(campaigns);
            });
        }catch(err){
            console.log(err);
        }
    }
});

router.post('/dismiss', (req, res) => {
    res.json(true);
});

module.exports = router;