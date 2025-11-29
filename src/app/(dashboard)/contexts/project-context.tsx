"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Project {
  id: number
  project_id: string
  name: string
  domain: string
  api_key: string
  created_at: string
}

interface ProjectContextType {
  projects: Project[]
  selectedProject: Project | null
  setSelectedProject: (project: Project) => void
  loadProjects: () => Promise<void>
  createProject: (name: string, domain: string) => Promise<void>
  deleteProject: (projectId: string) => Promise<void>
  loading: boolean
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProjects = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:3000/projects')
      const data = await res.json()
      setProjects(data.projects)
      
      // Restore from localStorage or auto-select first
      const savedProjectId = localStorage.getItem('selected_project_id')
      if (savedProjectId) {
        const saved = data.projects.find((p: Project) => p.project_id === savedProjectId)
        if (saved) {
          setSelectedProject(saved)
          return
        }
      }
      
      if (!selectedProject && data.projects.length > 0) {
        setSelectedProject(data.projects[0])
        localStorage.setItem('selected_project_id', data.projects[0].project_id)
      }
    } catch (err) {
      console.error('Failed to load projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (name: string, domain: string) => {
    try {
      const res = await fetch('http://localhost:3000/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, domain })
      })
      const data = await res.json()
      
      await loadProjects()
      setSelectedProject(data.project)
      localStorage.setItem('selected_project_id', data.project.project_id)
    } catch (err) {
      console.error('Failed to create project:', err)
      throw err
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      await fetch(`http://localhost:3000/projects/${projectId}`, {
        method: 'DELETE'
      })
      
      await loadProjects()
      
      if (selectedProject?.project_id === projectId) {
        const remaining = projects.filter(p => p.project_id !== projectId)
        if (remaining.length > 0) {
          setSelectedProject(remaining[0])
          localStorage.setItem('selected_project_id', remaining[0].project_id)
        } else {
          setSelectedProject(null)
          localStorage.removeItem('selected_project_id')
        }
      }
    } catch (err) {
      console.error('Failed to delete project:', err)
      throw err
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        setSelectedProject,
        loadProjects,
        createProject,
        deleteProject,
        loading
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return context
}