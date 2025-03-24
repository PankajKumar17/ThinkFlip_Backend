import express from 'express';
import NLPCloudClient from 'nlpcloud';

const router = express.Router();
const client = new NLPCloudClient({model:'paraphrase-multilingual-mpnet-base-v2',token:'51c3ce0359ded52a30781f97b44fa3960e1120dc', gpu:false});

router.post('/semantic-similarity', async (req, res) => {
    try {
        const { text1, text2 } = req.body;

        const response = await client.semanticSimilarity({
            sentences: [text1, text2],
        });

        res.json({ similarityScore: response.data });
    } catch (err) {
        res.status(err.response?.status || 500).json({
            error: err.response?.data?.detail || 'Internal Server Error',
        });
    }
});

export default router;
