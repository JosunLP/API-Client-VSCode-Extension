import { StateCreator } from "zustand";

import { SIDEBAR } from "../../constants";
import {
  ISidebarSlice,
  ISidebarSliceList,
  IUserRequestSidebarState,
} from "./type";

const sidebarSlice: StateCreator<ISidebarSlice, [], [], ISidebarSlice> = (
  set,
) => ({
  userFavorites: [],
  userRequestHistory: [],
  sidebarOption: SIDEBAR.HISTORY,
  projects: [],

  handleSidebarOption: (option: string) =>
    set(() => ({ sidebarOption: option })),

  handleUserHistoryCollection: (historyData: IUserRequestSidebarState[]) =>
    set(() => ({ userRequestHistory: historyData })),

  handleUserFavoritesCollection: (favoritesData: IUserRequestSidebarState[]) =>
    set(() => ({ userFavorites: favoritesData })),

  handleUserFavoriteIcon: (id: string, time: number | null) =>
    set((state) => ({
      userRequestHistory: state.userRequestHistory.map((historyData) =>
        historyData.id === id
          ? {
              ...historyData,
              isUserFavorite: !historyData.isUserFavorite,
              favoritedTime: time,
            }
          : historyData,
      ),
    })),

  handleUserDeleteIcon: (targetState: keyof ISidebarSliceList, id: string) => {
    set((state) => ({
      [targetState]: state[targetState].filter(
        (historyData) => historyData.id !== id,
      ),
    }));
  },

  addCollectionToFavorites: (collection: IUserRequestSidebarState[]) =>
    set((state) => ({
      userFavorites: [...collection, ...state.userFavorites],
    })),

  removeFromFavoriteCollection: (id: string) => {
    set((state) => ({
      userFavorites: state.userFavorites.filter(
        (historyData) => historyData.id !== id,
      ),
    }));
  },

  resetFavoriteIconState: () =>
    set((state) => ({
      userRequestHistory: state.userRequestHistory.map((historyData) =>
        historyData.isUserFavorite === true
          ? { ...historyData, isUserFavorite: false }
          : historyData,
      ),
    })),

  deleteCollection: (targetState: string) => {
    set(() => ({ [targetState]: [] }));
  },

  // Project management functions
  handleProjects: (projects: IProject[]) =>
    set(() => ({ projects })),

  addProject: (name: string) =>
    set((state) => ({
      projects: [
        ...state.projects,
        {
          id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          name,
          createdTime: Date.now(),
          collapsed: false,
        },
      ],
    })),

  updateProject: (id: string, name: string) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, name } : project,
      ),
    })),

  deleteProject: (id: string) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      // Remove project assignment from favorites
      userFavorites: state.userFavorites.map((favorite) =>
        favorite.projectId === id
          ? { ...favorite, projectId: undefined }
          : favorite,
      ),
    })),

  toggleProjectCollapse: (id: string) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? { ...project, collapsed: !project.collapsed }
          : project,
      ),
    })),

  assignToProject: (favoriteId: string, projectId: string | null) =>
    set((state) => ({
      userFavorites: state.userFavorites.map((favorite) =>
        favorite.id === favoriteId
          ? { ...favorite, projectId: projectId || undefined }
          : favorite,
      ),
    })),
});

export default sidebarSlice;
