const settingModule = require('./settings');


module.exports = {

    //Fetch Particular Setting
    getSetting : async ( data ) => {
        return await settingModule.findOne(data);
    },
    //Saving Document
    saveSetting : async ( data ) => {
        return await settingModule(data).save();
    },
    //Updating Document
    updateSetting: async ( id , data ) => {
        return await settingModule.updateOne(id,{$set:data})
    },
    //Fetch all Document
    getAllSetting: async () => {
        return await settingModule.find({deleted : false});
    }
}