import { InjectionToken } from 'tsyringe';
import { Config } from './config';

export const CONFIG_TOKEN = Symbol('Config') as InjectionToken<Config>;