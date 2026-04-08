import { create } from 'zustand'

interface UIStore {
  // Sidebar
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void

  // Global search
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Add Consultation modal
  addConsultationOpen: boolean
  addConsultationStudentId: string | undefined
  openAddConsultation: (studentId?: string) => void
  closeAddConsultation: () => void

  // Status filter (student list)
  statusFilter: string | null
  setStatusFilter: (status: string | null) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  addConsultationOpen: false,
  addConsultationStudentId: undefined,
  openAddConsultation: (studentId = undefined) =>
    set({ addConsultationOpen: true, addConsultationStudentId: studentId }),
  closeAddConsultation: () =>
    set({ addConsultationOpen: false, addConsultationStudentId: undefined }),

  statusFilter: null,
  setStatusFilter: (status) => set({ statusFilter: status }),
}))
