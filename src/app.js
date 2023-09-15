import cluster from 'cluster'
import { cpus } from 'os'
import express from 'express'

if (cluster.isPrimary) {
    for (let index = 0; index < 16 ; index++) {
        cluster.fork()
    }
} else {
    const app = express()
    app.get('/', (req, res) => res.json({status: 'success', message: `worker: ${process.pid}`}))
    app.get('/simple', (req, res) => {
        res.json({ status: 'success' })
    })
    
    app.get('/complex', (req, res) => {
        let sum = 0
        for (let index = 0; index < 5e8; index++) {
            sum += index
        }
        res.send({ sum })
    })
    app.listen(8080, () => console.log(`Server Up (${process.pid})`))
}