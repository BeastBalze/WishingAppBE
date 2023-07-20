const mongoose = require('mongoose');
exports.connectDb =  async () => {
    try {
        await mongoose.connect(process.env.MONGOURI)
        .then((con) => {console.log(`Connected to DB: ${con.connection.host}`)})
        .catch((err) => {console.log(err)});
    } catch (error) {
        console.log(error);
    }
};