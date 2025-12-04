import { Router, Request, Response, NextFunction } from 'express'
import Provider from '../schemas/provider'
import { CreateProviderRequest } from '../types/index'

const router = Router()

//router.get('/', getProviders)
//router.get('/:id', getProviderById)
router.post('/', createProvider)
router.put('/:id', updateProvider)

async function createProvider(
  req: Request<Record<string, never>, unknown, CreateProviderRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('Creating provider', req.body)

  if (!req.body.name) {
    console.error('Missing name parameter. Sending 400 to client')
    res.status(400).end()
    return
  }

  try {
    const provider = await Provider.create({
      ...req.body,
      isActive: req.body.isActive ?? true,
    })

    res.status(201).json(provider)
  } catch (err) {
    console.error('Error creating provider', err)
    next(err)
  }
}

async function updateProvider(
  req: Request<{ id: string }, unknown, Partial<CreateProviderRequest>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.params
  console.log(`Updating provider ${id}`, req.body)

  try {
    const provider = await Provider.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!provider) {
      console.error('Provider not found. Sending 404 to client')
      res.status(404).end()
      return
    }

    res.status(200).json(provider)
  } catch (err) {
    console.error('Error updating provider', err)
    next(err)
  }
}

export default router
