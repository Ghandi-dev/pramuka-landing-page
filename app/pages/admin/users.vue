<script setup lang="ts">
import { h } from "vue";
import { Plus, Pencil, Trash2, User } from "lucide-vue-next";
import { useUserService, type Profiles } from "~/services/userService";
import type { ColumnDef } from "@tanstack/vue-table";
import Button from "~/components/ui/button/Button.vue";
import DataTable from "~/components/admin/DataTable.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import ImageUploader from "~/components/admin/ImageUploader.vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

definePageMeta({ layout: "admin", middleware: "admin" });
useHead({
  title: "Kelola User",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const service = useUserService()
const { data, loading, fetchAll } = service
const { profile } = useAdminAuth()

const filteredData = computed(() => {
  return data.value.filter(u => u.id !== profile.value?.id)
})

const {
  dialogOpen, isEditing, confirmOpen, deleteTarget, saving, deleting, uploading,
  form, selectedFile, openCreate, openEdit, openDelete, onFileSelected, handleSave, handleDelete
} = useAdminPage<Profiles>(service as any, {
  itemName: 'User',
  imageField: 'avatar_url',
  defaultForm: { name: '', email: '', password: '', role: 'member', avatar_url: '' }
})

const columns: ColumnDef<Profiles, any>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      const user = row.original;
      return h("div", { class: "flex items-center gap-3" }, [
        h(
          "div",
          {
            class:
              "h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0",
          },
          [
            user.avatar_url
              ? h("img", {
                src: user.avatar_url,
                class: "h-full w-full object-cover",
              })
              : h(User, { class: "h-4 w-4 text-muted-foreground" }),
          ],
        ),
        h("div", {
          class: "max-w-[150px] lg:max-w-[250px] truncate font-medium",
          title: user.name
        }, user.name),
      ]);
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => h("div", {
      class: "max-w-[150px] lg:max-w-[250px] truncate text-muted-foreground",
      title: row.getValue("email")
    }, row.getValue("email"))
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return h(
        "span",
        {
          class: [
            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
            role === "admin"
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          ],
        },
        role,
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const user = row.original;
      return h("div", { class: "flex items-center gap-1" }, [
        h(
          Button,
          {
            variant: "ghost",
            size: "icon",
            class: "h-8 w-8",
            onClick: () => openEdit(user),
          },
          () => h(Pencil, { class: "h-4 w-4" }),
        ),
        h(
          Button,
          {
            variant: "ghost",
            size: "icon",
            class: "h-8 w-8 text-destructive hover:text-destructive",
            onClick: () => openDelete(user),
          },
          () => h(Trash2, { class: "h-4 w-4" }),
        ),
      ]);
    },
  },
];

onMounted(async () => {
  await fetchAll()
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">
          Manajemen User
        </h1>
        <p class="text-muted-foreground mt-1">Kelola akun admin dan anggota</p>
      </div>
      <Button @click="openCreate">
        <Plus class="w-4 h-4 mr-2" />
        Tambah User
      </Button>
    </div>

    <DataTable :columns="columns" :data="filteredData" :loading="loading" search-placeholder="Cari user..." />

    <Dialog v-model:open="dialogOpen">
      <DialogContent class="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{
            isEditing ? "Edit User" : "Tambah User Baru"
          }}</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleSave" class="space-y-4 pt-2">
          <div class="space-y-2">
            <Label for="name">Nama Lengkap</Label>
            <Input id="name" v-model="form.name" placeholder="Nama Lengkap" required />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" type="email" v-model="form.email" placeholder="email@example.com" :disabled="isEditing"
                required />
            </div>
            <div class="space-y-2" v-if="!isEditing">
              <Label for="password">Password</Label>
              <Input id="password" type="password" v-model="form.password" placeholder="••••••••" required />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="role">Role</Label>
            <Select v-model="form.role">
              <SelectTrigger id="role">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Avatar</Label>
            <ImageUploader :model-value="form.avatar_url" :loading="uploading"
              @file-selected="(f) => (selectedFile = f)" @update:model-value="
                (v) => {
                  if (!v) selectedFile = null;
                  form.avatar_url = v;
                }
              " />
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" @click="dialogOpen = false">Batal</Button>
            <Button type="submit" :disabled="saving || uploading">
              {{ saving || uploading ? "Menyimpan..." : "Simpan" }}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <ConfirmDialog v-model:open="confirmOpen" :loading="deleting" @confirm="handleDelete" />
  </div>
</template>
