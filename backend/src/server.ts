import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => {
    console.log(`🚀 PerlMe API running on http://localhost:${PORT}`);
    
});