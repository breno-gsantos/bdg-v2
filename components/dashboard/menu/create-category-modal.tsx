'use client'

import { createCategoryAction } from "@/actions/category/create-category-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { categoryTypesData } from "@/constants/admin/menu/data";
import { CategoryFormData, categorySchema } from "@/lib/validations/menu/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateCategoryModal({ }) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'foods'
    }
  })

  const { control, handleSubmit, formState, setError, clearErrors, reset } = form;
  const { isSubmitting } = formState

  async function onSubmit(values: CategoryFormData) {
    try {
      const response = await createCategoryAction(values);

      if (!response.success) {
        if (response.fieldError?.name) {
          setError('name', {
            type: 'server',
            message: response.fieldError.name[0]
          })
          return;
        }
        return;
      }

      toast.success(response.message)
      reset()
      setOpen(false);
    } catch (error) {
      toast.error('Erro interno do servidor')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Plus className="size-4" />
          Criar Categoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">Criar Categoria</DialogTitle>
          <DialogDescription className="sr-only">Descrição Formulário Categoria</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller control={control} name="name" render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nome da categoria</FieldLabel>
                <Input placeholder="Ex.: Lanches" id={field.name} aria-invalid={fieldState.invalid} {...field} disabled={isSubmitting} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />

            <Controller control={control} name="type" render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Tipo</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                  <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryTypesData.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Criando categoria...
                </>
              ) : (
                  <>
                    <FolderPlus className="size-4" />
                    Criar categoria
                  </>
              )}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}