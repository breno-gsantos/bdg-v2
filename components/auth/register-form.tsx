'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterData, registerFormSchema } from "@/lib/validations/auth/register-schema";
import { UserRole } from "@/lib/generated/prisma/enums";
import { Send } from "lucide-react";
import { registerAction } from "@/actions/auth/register-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'ADMIN'
    }
  })

  const { control, handleSubmit, formState, setError, reset } = form
  const { isSubmitting } = formState

  async function onSubmit(values: RegisterData) {
    try {
      const response = await registerAction(values);

      if (!response.success) {
        if (response.fieldError?.email) {
          setError('email', {
            type: 'server',
            message: response.fieldError.email[0]
          })
          return;
        }
        return;
      }

      toast.success(response.message)
      reset();
      router.push('/admin/users')
    } catch (error) {
      toast.error('Erro interno do servidor')
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-sm md:max-w-xl overflow-hidden p-0">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <FieldGroup>
              <Controller control={control} name="name" render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                  <Input placeholder="João da Silva" id={field.name} aria-invalid={fieldState.invalid} {...field} disabled={isSubmitting} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )} />

              <Controller control={control} name="email" render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input type="email" placeholder="adm.botecodogonza@gmail.com" id={field.name} aria-invalid={fieldState.invalid} {...field} disabled={isSubmitting} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <Controller control={control} name="password" render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                    <Input type="password" placeholder="********" id={field.name} aria-invalid={fieldState.invalid} {...field} disabled={isSubmitting} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )} />

                <Controller control={control} name="confirmPassword" render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Confirmar Senha</FieldLabel>
                    <Input type="password" placeholder="********" id={field.name} aria-invalid={fieldState.invalid} {...field} disabled={isSubmitting} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )} />
              </div>

              <Controller control={control} name="role" render={({ field, fieldState }) => (
                <Field orientation='responsive' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Cargo</FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="min-w-30" disabled={isSubmitting}>
                      <SelectValue placeholder="Selecione um cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRole.ROOT}>Root</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )} />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Criar conta
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}