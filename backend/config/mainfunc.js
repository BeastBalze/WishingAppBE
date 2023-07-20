const Wish = require('../models/wish');
const User = require('../models/user');
const { sendEmail } = require('./sendmail');

exports.mainfunc = async () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    try {
        const wlist = await Wish.find({day, month}).populate("owner");
        for(var i = 0; i < wlist.length; i++)
        {
            await sendEmail({
                email: wlist[i].reciverMail,
                subject: `Wishes for ${wlist[i].ocassion}`,
                message: `Wishing you on the ocassion of ${wlist[i].ocassion} from ${wlist[i].owner.name}\n\n
                ${wlist[i].owner.name}: "${wlist[i].message}"`
            });
        }
    } catch (error) {
        console.log(error.message);
    }
}