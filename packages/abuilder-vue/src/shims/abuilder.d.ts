/**
 * Vue 包装包 typecheck 用桩：避免 vue-tsc（jsx:preserve）沿着
 * @arronqzy/abuilder → react-view → view-scene3d 的 React/R3F 源码报错。
 * 运行时仍解析真实的 @arronqzy/abuilder。
 */
import type { ComponentType, ForwardRefExoticComponent, RefAttributes } from "react";

export type Locale = "zh-CN" | "en-US";
export type AbuilderPlugin = "ai";
export type WorkspaceProjectRecord = Record<string, unknown> & {
  id?: string;
};

export type AbuilderViewHandle = {
  getNameSpace: () => string | null;
  getCurrentWorkspace: () => unknown;
  openWorkspace: (idOrRecord: unknown) => Promise<unknown>;
  createWorkspace: () => Promise<unknown>;
  saveWorkspace: () => Promise<unknown>;
  syncWorkspace: () => Promise<unknown>;
};

export type AbuilderAppProps = {
  className?: string;
  initialZoom?: number;
  defaultTheme?: "dark" | "light";
  locale?: Locale | null;
  previewSearch?: string;
  preview?: boolean;
  initialWorkspace?: WorkspaceProjectRecord | null;
  workspaceId?: string | null;
  nameSpace?: string | null;
  plugins?: AbuilderPlugin[];
  pIcon?: string | null;
  pTitle?: string | null;
};

export declare const App: ForwardRefExoticComponent<
  AbuilderAppProps & RefAttributes<AbuilderViewHandle>
>;

export declare const ABUILDER_PACKAGE_NAME: string;
export declare const ABUILDER_VERSION: string;

export declare const ReactViewPanel: ComponentType<any>;
export declare const ReactViewOnlinePreview: ComponentType<any>;
export declare const parseOnlinePreviewSearchParams: (...args: any[]) => any;
export declare const parseViewData: (...args: any[]) => any;
export declare const validateViewData: (...args: any[]) => any;
export declare const parseBlueprintData: (...args: any[]) => any;
export declare const validateBlueprintData: (...args: any[]) => any;
export declare const validateWorkspaceData: (...args: any[]) => any;
export declare const parseWorkspaceData: (...args: any[]) => any;
export declare const createEmptyWorkspace: (...args: any[]) => any;
export declare const createWorkspaceProjectId: (...args: any[]) => any;
export declare const listWorkspaceProjects: (...args: any[]) => any;
export declare const getWorkspaceProject: (...args: any[]) => any;
export declare const putWorkspaceProject: (...args: any[]) => any;
export declare const upsertWorkspaceProject: (...args: any[]) => any;
export declare const deleteWorkspaceProject: (...args: any[]) => any;
export declare const clearWorkspaceProjects: (...args: any[]) => any;
export declare const listBlueprintLibrary: (...args: any[]) => any;
export declare const getBlueprintLibraryRecord: (...args: any[]) => any;
export declare const putBlueprintLibraryRecord: (...args: any[]) => any;
export declare const deleteBlueprintLibraryRecord: (...args: any[]) => any;
export declare const clearBlueprintLibrary: (...args: any[]) => any;
export declare const listExecutionRunRecords: (...args: any[]) => any;
export declare const getExecutionRunRecord: (...args: any[]) => any;
export declare const putExecutionRunRecord: (...args: any[]) => any;
export declare const deleteExecutionRunRecord: (...args: any[]) => any;
export declare const clearAllExecutionRunRecords: (...args: any[]) => any;
export declare const purgeExecutionRunsOlderThan: (...args: any[]) => any;
export declare const trimExecutionRunRecordsToMax: (...args: any[]) => any;
export declare const readExecutionLogSettings: (...args: any[]) => any;
export declare const writeExecutionLogSettings: (...args: any[]) => any;
export declare const listApiCollectionRecords: (...args: any[]) => any;
export declare const putApiCollection: (...args: any[]) => any;
export declare const upsertApiCollectionFromJson: (...args: any[]) => any;
export declare const deleteApiCollection: (...args: any[]) => any;
export declare const clearApiCollections: (...args: any[]) => any;
export declare const clearAbuilderStorage: (...args: any[]) => any;
export declare const getCurrentWorkspace: (...args: any[]) => any;
export declare const openWorkspace: (...args: any[]) => any;
export declare const createWorkspace: (...args: any[]) => any;
export declare const saveWorkspace: (...args: any[]) => any;
export declare const syncWorkspace: (...args: any[]) => any;
export declare const getPreviewSnapshot: (...args: any[]) => any;
export declare const addEventSubscription: (...args: any[]) => any;
export declare const AbuilderEvents: Record<string, string>;

export type ReactViewPanelProps = any;
export type AbuilderEventName = string;
export type AbuilderEventPayloadMap = Record<string, any>;
export type AddEventSubscriptionOptions = any;
export type WorkspaceAddEventPayload = any;
export type WorkspaceSyncEventPayload = any;
export type WorkspaceDeleteEventPayload = any;
export type BlueprintLibraryChangedEventPayload = any;
export type ApiCollectionUploadStartEventPayload = any;
export type ApiCollectionUploadSuccessEventPayload = any;
export type ApiCollectionChangedEventPayload = any;
export type WorkspaceData = any;
export type WorkspaceProjectListItem = any;
export type PutWorkspaceProjectOptions = any;
export type AbuilderStorageClearResult = any;
export type BlueprintLibraryListItem = any;
export type BlueprintLibraryRecord = any;
export type ExecutionRunRecord = any;
export type ExecutionLogSettings = any;
export type ApiCollectionRecord = any;
export type UpsertApiCollectionInput = any;
export type UpsertApiCollectionResult = any;
export type GetPreviewSnapshotOptions = any;
export type ParseCheckResult = any;
export type WorkspaceParseCheckResult = any;
