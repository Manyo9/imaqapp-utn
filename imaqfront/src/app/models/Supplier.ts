export interface Supplier {
    idProveedor: number,
    cuit: string,
    razonSocial: string,
    nombreContacto: string,
    calle: string,
    numCalle: number,
    observaciones: string,
    email: string,
    telefono: number,
    activo: boolean
}

export type SupplierListDTO = Omit<Supplier, 'calle' | 'numCalle' | 'observaciones'>
export type SupplierNewDTO = Omit<Supplier, 'idProveedor' | 'activo'>
export type SupplierEditDTO = Pick<Supplier, 'idProveedor' | 'cuit' | 'razonSocial' | 
'nombreContacto' | 'calle' | 'numCalle' | 'observaciones' | 'email' | 'telefono' | 'activo'>;