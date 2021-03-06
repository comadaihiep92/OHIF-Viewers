import { DICOMTagDescriptions } from './DICOMTagDescriptions';
import ObjectPath from './objectPath';
import StackManager from './StackManager.js';
import absoluteUrl from './absoluteUrl';
import addServers from './addServers';
import guid from './guid';
import sortBy from './sortBy.js';
import studyMetadataManager from './studyMetadataManager';
import updateMetaDataManager from './updateMetaDataManager.js';
import writeScript from './writeScript.js';
import DicomLoaderService from './dicomLoaderService.js';

const utils = {
  guid,
  ObjectPath,
  absoluteUrl,
  addServers,
  sortBy,
  writeScript,
  StackManager,
  studyMetadataManager,
  // Updates WADO-RS metaDataManager
  updateMetaDataManager,
  DICOMTagDescriptions,
  DicomLoaderService,
};

export {
  guid,
  ObjectPath,
  absoluteUrl,
  addServers,
  sortBy,
  writeScript,
  StackManager,
  studyMetadataManager,
  // Updates WADO-RS metaDataManager
  updateMetaDataManager,
  DICOMTagDescriptions,
  DicomLoaderService,
};

export default utils;
