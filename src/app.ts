import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

import statusRouter from './routes/status'
import authRouter from './routes/auth'
import userRouter from './routes/user'
import authorization from './middlewares/authorization'
import serviceRouter from './routes/service'
import subscriptionRouter from './routes/subscription'
import providerRouter from './routes/provider'
import notificationRouter from './routes/notification'
import paymentRouter from './routes/payment'
import registerRouter from './routes/register'

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/', statusRouter)
app.use('/register', registerRouter)s
app.use(authorization)

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/services', serviceRouter)
app.use('/subscriptions', subscriptionRouter)
app.use('/providers', providerRouter)
app.use('/notifications', notificationRouter)
app.use('/payments', paymentRouter)

export default app
