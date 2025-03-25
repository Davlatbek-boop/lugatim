const {Schema, model} = require("mongoose")


const wordsSchema = new Schema(
    {
        word:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            index:true,
            lowercase:true
        },
        lette:{
            type:String,
            index:true
        },

    },
    {
        versionKey:false
    }
)

module.exports = model("Words", wordsSchema)