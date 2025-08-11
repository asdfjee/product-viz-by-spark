import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { projectAPI, UserProject } from '@/lib/supabase'
import { ArrowLeft } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<UserProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const p = await projectAPI.getById(id)
        setProject(p)
      } catch (e: any) {
        console.error(e)
        setError('Failed to load project')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>

      {loading && (
        <Card className="max-w-3xl">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <CardTitle>Loading project...</CardTitle>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && error && (
        <Card className="max-w-3xl">
          <CardContent className="p-6">
            <CardTitle>Error</CardTitle>
            <CardDescription className="text-red-500 mt-2">{error}</CardDescription>
          </CardContent>
        </Card>
      )}

      {!loading && !error && !project && (
        <Card className="max-w-3xl">
          <CardContent className="p-6">
            <CardTitle>Project not found</CardTitle>
            <CardDescription className="mt-2">We couldn't find that project.</CardDescription>
          </CardContent>
        </Card>
      )}

      {!loading && project && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {project.thumbnail && (
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full max-h-[420px] object-cover rounded-md mb-6"
                  />
                )}
                <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                <p className="text-muted-foreground mb-4">
                  {project.description || 'No description provided'}
                </p>
                <div className="text-sm text-muted-foreground">
                  Created {new Date(project.created_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <CardTitle className="mb-2">Visualization Requests</CardTitle>
                {Array.isArray(project.visualization_requests) && project.visualization_requests.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {project.visualization_requests.map((req: any, idx: number) => (
                      <li key={idx} className="text-sm">
                        {typeof req === 'string' ? req : JSON.stringify(req)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <CardDescription>No requests yet.</CardDescription>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectPage