<script setup lang="ts" generic="TData, TValue">
import {
    FlexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useVueTable,
    type ColumnDef,
    type SortingState,
} from '@tanstack/vue-table'
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const props = defineProps<{
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
    searchPlaceholder?: string
    loading?: boolean
}>()

const sorting = ref<SortingState>([])
const globalFilter = ref('')

const table = useVueTable({
    get data() { return props.data },
    get columns() { return props.columns },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        get sorting() { return sorting.value },
        get globalFilter() { return globalFilter.value },
    },
    onSortingChange: (updaterOrValue) => {
        sorting.value = typeof updaterOrValue === 'function'
            ? updaterOrValue(sorting.value)
            : updaterOrValue
    },
    onGlobalFilterChange: (updaterOrValue) => {
        globalFilter.value = typeof updaterOrValue === 'function'
            ? updaterOrValue(globalFilter.value)
            : updaterOrValue
    },
    initialState: {
        pagination: {
            pageSize: 10,
        },
    },
})
</script>

<template>
    <div class="space-y-4">
        <!-- Search -->
        <div class="flex items-center gap-4">
            <Input :placeholder="searchPlaceholder || 'Cari...'" :model-value="globalFilter"
                @update:model-value="(val: any) => globalFilter = String(val)" class="max-w-sm" />
            <slot name="toolbar" />
        </div>

        <!-- Table -->
        <div class="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id"
                            class="text-xs font-semibold uppercase tracking-wider">
                            <template v-if="!header.isPlaceholder">
                                <button v-if="header.column.getCanSort()"
                                    class="flex items-center gap-1 hover:text-foreground transition-colors"
                                    @click="header.column.toggleSorting()">
                                    <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                                    <ArrowUpDown class="w-3 h-3" />
                                </button>
                                <FlexRender v-else :render="header.column.columnDef.header"
                                    :props="header.getContext()" />
                            </template>
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <!-- Loading skeleton -->
                    <template v-if="loading">
                        <TableRow v-for="i in 5" :key="`skeleton-${i}`">
                            <TableCell v-for="j in columns.length" :key="`skeleton-cell-${j}`">
                                <div class="h-4 bg-muted animate-pulse rounded w-3/4" />
                            </TableCell>
                        </TableRow>
                    </template>

                    <!-- Rows -->
                    <template v-else-if="table.getRowModel().rows?.length">
                        <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
                            class="hover:bg-muted/50 transition-colors">
                            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                            </TableCell>
                        </TableRow>
                    </template>

                    <!-- Empty -->
                    <template v-else>
                        <TableRow>
                            <TableCell :colspan="columns.length" class="h-24 text-center text-muted-foreground">
                                Tidak ada data ditemukan.
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between text-sm text-muted-foreground">
            <span>
                Halaman {{ table.getState().pagination.pageIndex + 1 }} dari {{ table.getPageCount() }}
                ({{ table.getFilteredRowModel().rows.length }} data)
            </span>
            <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()"
                    @click="table.previousPage()">
                    <ChevronLeft class="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
                    <ChevronRight class="w-4 h-4" />
                </Button>
            </div>
        </div>
    </div>
</template>
