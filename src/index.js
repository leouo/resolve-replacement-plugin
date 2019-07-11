const path = require('path')
const fs = require('fs')

const removeQueryString = filePath => filePath.replace(/\?.+/, '')

class ResolveReplacementPlugin {
  constructor (options) {
    this.sourceDirectory = options.sourceDirectory
    this.targetDirectory = options.targetDirectory
    this.sourceRootPath = null
  }

  async getTargetFilePath (sourceFilePath, targetDirectoryPath) {
    const relativetargetFilePath = sourceFilePath.replace(this.sourceRootPath, '')
    const targetFilePath = `${targetDirectoryPath}${relativetargetFilePath}`
    const targetFileExists = await fs.existsSync(removeQueryString(targetFilePath))

    if (targetFileExists) {
      return targetFilePath
    } else {
      throw new Error(`Target file not found: ${targetDirectoryPath}`)
    }
  }

  async getTargetDirectoryPath (sourceFilePath) {
    const sourceDirectoryPath = path.resolve(sourceFilePath, '..')
    const targetDirectoryPath = `${sourceDirectoryPath}/${this.targetDirectory}`
    const targetDirectoryExists = await fs.existsSync(targetDirectoryPath)

    if (targetDirectoryExists) {
      this.sourceRootPath = sourceDirectoryPath

      return targetDirectoryPath
    }

    if (sourceDirectoryPath === this.sourceDirectory) {
      throw new Error(`Target directory not found: ${targetDirectoryPath}`)
    }

    return await this.getTargetDirectoryPath(sourceDirectoryPath)
  }

  apply (resolver) {
    resolver.hooks.resolve.tapAsync("ResolveReplacementPlugin", async (resolveData, resolveContext, callback) => {
      const sourceFilePath = path.resolve(resolveData.path, resolveData.request)

      if (sourceFilePath.includes(this.sourceDirectory)) {
        try {
          const targetDirectoryPath = await this.getTargetDirectoryPath(sourceFilePath)
          const targetFilePath = await this.getTargetFilePath(sourceFilePath, targetDirectoryPath)

          const updatedResolve = {
            ...resolveData,
            request: targetFilePath
          }

          resolver.doResolve(resolver.hooks.resolve, updatedResolve, null, resolveContext, callback);
        } catch (error) {
          callback()
        }
      } else {
        callback()
      }
    })
  }
}

export default ResolveReplacementPlugin
