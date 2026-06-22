'use client'

import { uploadMenuImage } from "@/actions/images/upload-image";
import { createMenuItemAction } from "@/actions/menu/create-menu-item-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { menuItemFormData, menuItemFormSchema } from "@/lib/validations/menu/menu-item-schema";
import { CategoryDTO } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateMenuItemProps{
  categories: CategoryDTO[]
}

export function CreateMenuItem({ categories }: CreateMenuItemProps) {
  const router = useRouter()

  const form = useForm<menuItemFormData>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      imageUrl: undefined,
      isAvailable: true,
      isFeatured: false,
      categoryId: ''
    }
  })

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
  
    const objectUrl = URL.createObjectURL(imageFile);
  
    setPreviewUrl(objectUrl);
  
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [imageFile])

  const { control, handleSubmit, formState, setError, clearErrors, reset } = form
  const { isSubmitting } = formState

  async function onSubmit(values: menuItemFormData) {
    try {
      let imageUrl: string | undefined = undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        imageUrl = await uploadMenuImage(formData);
      }

      const response = await createMenuItemAction({
        ...values,
        imageUrl
      });

      if (!response.success) {
        setError('root', {
          type: 'manual',
          message: response.error
        })

        toast.error(response.error)
        return;
      }

      clearErrors()

      toast.success(response.message)
      reset()
      setImageFile(null);
      setPreviewUrl(null);
      router.push('/admin/cardapio')
    } catch (error) {
      toast.error('Erro interno do Servidor')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-3xl shadow-md">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-5 gap-8">

              <div className="col-span-3">
                <FieldGroup>
                  <Controller control={control} name="name" render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                      <Input placeholder="Ex.: Smash Burguer" id={field.name} aria-invalid={fieldState.invalid} {...field} disabled={isSubmitting} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )} />

                  <Controller control={control} name="description" render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Descrição (opcional)</FieldLabel>
                      <Textarea placeholder="Ex.: Delicioso Smash Burguer..." id={field.name} aria-invalid={fieldState.invalid} {...field} disabled={isSubmitting} className="resize-none" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )} />

                  <Controller control={control} name="price" render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Preço (R$)</FieldLabel>
                      <Input
                        placeholder="Ex.: R$48,90"
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value

                          if (/^\d*([.,]?\d{0,2})?$/.test(value)) {
                            field.onChange(value)
                          }
                        }}
                        disabled={isSubmitting} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )} />
                </FieldGroup>
              </div>

              <div className="col-span-2">
                <FieldGroup>
                  <Controller control={control} name="categoryId" render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Categoria</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder='Selecione uma categoria' />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )} />

                  <div className="rounded-xl border border-border bg-card p-6">
                    <Controller control={control} name="isAvailable" render={({ field, fieldState }) => (
                      <Field orientation='horizontal' className="w-fit" data-invalid={fieldState.invalid}>
                        <div>
                          <FieldLabel htmlFor={field.name}>Item ativo</FieldLabel>
                          <FieldDescription>Visível no site público</FieldDescription>
                        </div>
                        <Switch checked={field.value} onCheckedChange={field.onChange} id={field.name} disabled={isSubmitting} />
                      </Field>
                    )} />
                  </div>

                  <div className="rounded-xl border border-border bg-card p-6">
                    <Controller control={control} name="isFeatured" render={({ field, fieldState }) => (
                      <Field orientation='horizontal' className="w-fit" data-invalid={fieldState.invalid}>
                        <div>
                          <FieldLabel htmlFor={field.name}>Item em destaque</FieldLabel>
                          <FieldDescription>Visível no site público</FieldDescription>
                        </div>
                        <Switch checked={field.value} onCheckedChange={field.onChange} id={field.name} disabled={isSubmitting} />
                      </Field>
                    )} />
                  </div>
                </FieldGroup>
              </div>

            </div>

            <FieldGroup className="mt-6">
              <Controller control={control} name="imageUrl" render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Imagem</FieldLabel>
                  <Input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      field.onChange(file)
                      setImageFile(file)
                    }}
                  />
                  <div onClick={() => inputRef.current?.click()} className="relative flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50">
                    {previewUrl ? (
                      <Image src={previewUrl} alt="Preview" fill className="object-contain" sizes="500px" />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto size-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Clique para selecionar uma imagem
                        </p>
                      </div>
                    )}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )} />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Criando Item...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Criar Item
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