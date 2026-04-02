export interface IBaseService<
  T,
  CreateDto = unknown,
  UpdateDto = unknown,
  ReturnType = T,
> {
  create(createDto: CreateDto): Promise<ReturnType>;
  findAll?(): Promise<ReturnType[]>;
  findOne(id: string | number): Promise<ReturnType>;
  update?(id: string | number, updateDto: UpdateDto): Promise<ReturnType>;
  remove?(id: string | number): Promise<ReturnType | void>;
}
