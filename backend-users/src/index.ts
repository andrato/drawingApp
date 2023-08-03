import app from "./app";

const PORT: number | string = process.env.PORT || 6000;

app.listen(PORT, () => {console.log(`Listening on port ${process.env.PORT}`)});