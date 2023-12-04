export interface Product {
    idProducto: number,
    idTipoProducto: number,
    tipoProducto?: string,
    nombre: string,
    descripcion?: string,
    precio: number,
    codigoParte?: string,
    activo: boolean
}

export type ProductListDTO = Omit<Product, 'idTipoProducto'>
export type ProductEditDTO = Omit<Product, 'tipoProducto'>
export type ProductNewDTO = Pick<Product, 'idTipoProducto' | 'nombre' | 'descripcion' | 'precio' | 'codigoParte'>