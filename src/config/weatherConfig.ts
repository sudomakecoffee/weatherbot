import { readFileSync } from "fs";
import { join } from "path";
import { WeatherConfigData } from "./weatherConfigData";
import { logger } from "../logger";

export class WeatherConfig {
  private static _instance: WeatherConfig;
  private _configName: string;
  private _currentConfig: Map<string, WeatherConfigData[]>;

  private constructor(file: string) {
    this._configName = file;
    this._currentConfig = this.load();
  }

  static getInstance(): WeatherConfig {
    if (!WeatherConfig._instance) {
      const file = "../weatherConf.json";
      WeatherConfig._instance = new WeatherConfig(file);
    }
    return WeatherConfig._instance;
  }

  public get config(): Map<string, WeatherConfigData[]> {
    if (!this._currentConfig) {
      this._currentConfig = WeatherConfig.getInstance().load();
    }
    return this._currentConfig;
  }

  public load(): Map<string, WeatherConfigData[]> {
    let config = new Map<string, WeatherConfigData[]>();

    try {
      const file = join(__dirname, this._configName);
      const data = readFileSync(file, { encoding: "utf8" });
      const json = JSON.parse(data);
      for (let key in json) {
        config.set(key, json[key]);
      }
    } catch (e: any) {
      logger.warn("Error loading weather config, using default");
    }

    return config;
  }

  public save(): void {
    throw new Error("WeatherConfig.save not implemented");
  }
}
