const app = require('./app');
const { connectDb } = require('./config/db');

connectDb();
app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});