'use client'

import { LoginData, loginFormSchema } from "@/lib/validations/auth/login-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircleIcon, LogIn, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { loginAction } from "@/actions/auth/login-action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const router = useRouter()

  const form = useForm<LoginData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  
  const { control, handleSubmit, formState, setError, reset, resetField } = form
  const { isSubmitting } = formState

  async function onSubmit(values: LoginData) {
    try {
      const response = await loginAction(values);

      if (!response.success) {
        setError('root', {
          type: 'server',
          message: response.error
        })
        resetField('password')
        return;
      }

      toast.success(response.message)
      reset();
      router.push('/admin');
    } catch (error) {
      toast.error('Erro interno do servidor');
    }
  }

  return (
    <Card className="w-full max-w-sm md:max-w-4xl overflow-hidden p-0">
      <CardContent className="grid p-0 md:grid-cols-2">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <ShieldCheck className="size-8 text-primary" />

              <h1 className="text-2xl font-bold">
                Área Administrativa
              </h1>
              <p className="text-muted-foreground text-balance">
                Entre para acessar o painel administrativo e gerenciar o conteúdo da plataforma.
              </p>
            </div>
            <Controller control={control} name="email" render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input type="email" placeholder="adm.botecodogonza@gmail.com" id={field.name} aria-invalid={fieldState.invalid} {...field} disabled={isSubmitting} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />

            <Controller control={control} name="password" render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                <Input type="password" placeholder="********" id={field.name} aria-invalid={fieldState.invalid} {...field} disabled={isSubmitting} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />

            {formState.errors.root && (
              <Alert variant='destructive'>
                <AlertCircleIcon />
                <AlertDescription>
                  {formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  Entrar na conta
                </>
              )}
            </Button>
          </FieldGroup>
        </form>

        <div className="relative hidden bg-muted md:block">
          <Image src='/bdg-wall.jpg' alt="Wall" fill priority className="absolute inset-0 object-cover size-full dark:brightness-[0.2] dark:grayscale" sizes="(max-width: 768px) 0px, 50vw" />
        </div>
      </CardContent>
    </Card>
  )
}