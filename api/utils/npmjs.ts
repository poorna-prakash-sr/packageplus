import axios, { AxiosResponse } from 'axios';
import zlib from 'zlib';
import { IResult } from '../types/custom/result';

class Npm {
  private _datastore: any;

  /**
   * Loads specific npm package info.
   *
   * @param packageName - REQUIRED: npm package name. example: `yarn`
   * @param size - OPTIONAL: number of results to return. example: `1`
   * @returns an object with a `parsed` key if successful or `error` key if an error occurred. example: { result: { KEY: 'value' } }
   *
   */
  async getPackageInfo(packageName: string, size: number = 1) {
    if (!packageName) throw new Error('Package name is required');
    try {
      // npmjs registry api url to get package info
      const url: string = `https://registry.npmjs.com/-/v1/search?text=${packageName}&size=${size}`;
      // npms api url to get package details
      const apirul: string = `https://api.npms.io/v2/package/${packageName}`;
      const [urldata, apidata] = await Promise.all([
        axios.get(url),
        axios.get(apirul),
      ]);

      const data = urldata.data;

      this._datastore = apidata.data;
      const selected = data.objects[0];
      const result: IResult = {
        name: selected.package.name,
        version: selected.package.version,
        description: selected.package.description,
        github: selected.package.links.repository,
        npm: selected.package.links.npm,
        homepage: selected.package.links.homepage,
        date: new Date(selected.package.date).toString(),
        score: this._getScore(),
        maintainabilityScore: await this._getMaintainabilityScore(),
        dependenciesCount: await this._getdependenciesCount(),
        license: await this._getLincenseinfo(),
        size: await this._getPackageSize(packageName),
      };
      return result;
    } catch (err) {
      console.log(err);
      return { error: 'No Pacakges Found' };
    }
  }

  /**
   * To get the score of the package based on the quality, popularity and maintenance
   * @returns a score of the package
   */
  _getScore() {
    return (
      ((this._datastore.score.detail.quality +
        this._datastore.score.detail.popularity +
        this._datastore.score.detail.maintenance) /
        3) *
      100
    );
  }

  /**
   * To get the size of the package
   * @returns a size and gzipped size of the package
   */
  _getPackageSize = async (
    packageName: string
  ): Promise<{ size: number; gzippedSize: number }> => {
    const packageInfoUrl = `https://registry.npmjs.org/${packageName}`;
    const response = await axios.get(packageInfoUrl);

    const packageVersion = response.data['dist-tags'].latest;
    const packageDistUrl = response.data.versions[packageVersion].dist.tarball;

    const packageTarballResponse = await axios.get(packageDistUrl, {
      responseType: 'arraybuffer',
    });
    const packageTarballSize = packageTarballResponse.data.byteLength;

    const gzippedSize = zlib.gzipSync(packageTarballResponse.data).byteLength;

    return { size: packageTarballSize, gzippedSize };
  };

  /**
   * To get the license of the package from the npms api
   * @returns a license of the package
   */
  _getLincenseinfo = async (): Promise<string> => {
    const license: string = this._datastore.collected.metadata.license;
    return license;
  };

  /**
   * To get the score of the package based on the quality, popularity and maintenance
   * @returns a score of the package
   */
  _getMaintainabilityScore = async (): Promise<number> => {
    const maintainabilityScore: number =
      ((this._datastore.evaluation.maintenance.releasesFrequency +
        this._datastore.evaluation.maintenance.commitsFrequency) /
        2) *
      100;
    return maintainabilityScore;
  };

  _getdependenciesCount = async (): Promise<number> => {
    if (this._datastore.collected.metadata.dependencies !== undefined) {
      const totalCount = Object.keys(
        this._datastore.collected.metadata.dependencies
      ).length;

      return totalCount;
    }
    return 0;
  };
}

export default new Npm();
