"use client"

import { useState } from 'react'
import { useProject } from '@/app/(dashboard)/contexts/project-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Settings2, Copy, Check, Trash2 } from "lucide-react"
import type { Project } from '@/app/(dashboard)/contexts/project-context'

export function ProjectSelector() {
  const { projects, selectedProject, setSelectedProject, createProject, deleteProject } = useProject()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDomain, setNewProjectDomain] = useState('')
  const [creating, setCreating] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  const handleCreate = async () => {
    if (!newProjectName || !newProjectDomain) return
    
    setCreating(true)
    try {
      await createProject(newProjectName, newProjectDomain)
      setNewProjectName('')
      setNewProjectDomain('')
      setIsCreateOpen(false)
    } catch (err) {
      console.error('Failed to create project:', err)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedProject) return
    if (!confirm(`Are you sure you want to delete "${selectedProject.name}"? This will delete all associated data.`)) return
    
    try {
      await deleteProject(selectedProject.project_id)
      setIsDetailsOpen(false)
    } catch (err) {
      console.error('Failed to delete project:', err)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  if (!selectedProject) return null

  return (
    <div className="flex items-center gap-2">
      {/* Project Selector */}
      <Select
        value={selectedProject.project_id}
        onValueChange={(value: string) => {
          const project = projects.find((p: Project) => p.project_id === value)
          if (project) {
            setSelectedProject(project)
            localStorage.setItem('selected_project_id', value)
          }
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project: Project) => (
            <SelectItem key={project.project_id} value={project.project_id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Create Project Button */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new website to track analytics
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="My Awesome Website"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                placeholder="example.com"
                value={newProjectDomain}
                onChange={(e) => setNewProjectDomain(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Settings Button */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProject.name}</DialogTitle>
            <DialogDescription>
              Project settings and installation
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Project ID</Label>
              <div className="flex gap-2">
                <Input value={selectedProject.project_id} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(selectedProject.project_id)}
                >
                  {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>API Key</Label>
              <div className="flex gap-2">
                <Input value={selectedProject.api_key} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(selectedProject.api_key)}
                >
                  {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Domain</Label>
              <Input value={selectedProject.domain} readOnly />
            </div>

            <div className="grid gap-2">
              <Label>Installation Code</Label>
              <div className="relative">
                <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
{`<script src="http://localhost:3000/pixel.js" 
        data-project="${selectedProject.project_id}">
</script>`}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`<script src="http://localhost:3000/pixel.js" data-project="${selectedProject.project_id}"></script>`)}
                >
                  {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Add this code before the closing &lt;/body&gt; tag on your website
              </p>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}