export interface IFormRowModel {
  getId: () => string;
  getPublicName: () => string;
  getRequired: () => boolean;
  getDescription: () => string;
  toDescriptor: () => IFormRowModelDescriptor;
  getType: () => FormRowModelTypeType;
  clone: (update: Partial<IFormRowModelDescriptor>) => FormRowModel;
}

export interface IFormRowModelDescriptor {
  id: string;
  publicName: string;
  required?: boolean;
  description?: string;
  type?: FormRowModelTypeType;
}

export type FormRowModelTypeType = 'calc' | 'input';

export class FormRowModel implements IFormRowModel {
  private readonly _id: string;
  private readonly _publicName: string;
  private readonly _required: boolean;
  private readonly _description: string;
  // TODO: Заменить на наследование классов
  private readonly _type: FormRowModelTypeType;

  constructor(descriptor: IFormRowModelDescriptor) {
    this._id = descriptor.id;
    this._publicName = descriptor.publicName;
    this._required = descriptor.required || false;
    this._description = descriptor.description || '';
    this._type = descriptor.type || 'input';
  }

  getDescription(): string {
    return this._description;
  }

  getId(): string {
    return this._id;
  }

  getPublicName(): string {
    return this._publicName;
  }

  getRequired(): boolean {
    return this._required;
  }

  toDescriptor(): IFormRowModelDescriptor {
    return {
      id: this._id,
      publicName: this._publicName,
      required: this._required,
      description: this._description,
      type: this._type
    };
  }

  clone(update: Partial<IFormRowModelDescriptor>): FormRowModel {
    return new FormRowModel({
      ...this.toDescriptor(),
      ...update
    });
  }

  getType(): FormRowModelTypeType {
    return this._type;
  }

  static serialize(formRowModel: FormRowModel): IFormRowModelDescriptor {
    return formRowModel.toDescriptor();
  }
  static deserialize(formRowModelDescriptor: IFormRowModelDescriptor): FormRowModel {
    return new FormRowModel(formRowModelDescriptor);
  }
}
