import { FormRowModel } from '@renderer/model/form/FormRow';
import {
  FormRowModelTypeType,
  IFormCalculatedRowDescription,
  IFormInputRowDescription
} from '@renderer/model/form/FormRow';
import { FormCalculatedRowModel, FormInputRowModel } from 'src/renderer/src/model/form/FormRow';

export interface IGetRowOptions {
  type?: FormRowModelTypeType | 'all';
}

export interface IFormModelDescriptor {
  rows: (IFormInputRowDescription | IFormCalculatedRowDescription)[];
  id: string;
  publicName: string;
  description?: string;
}

export interface IFormModel {
  getId: () => string;
  getPublicName: () => string;
  getDescription: () => string;
  toDescriptor(): IFormModelDescriptor;
  getRows: () => (FormInputRowModel | FormCalculatedRowModel)[];
}
export class FormModel implements IFormModel {
  private readonly _rows: (FormInputRowModel | FormCalculatedRowModel)[];
  private readonly _id: string;
  private readonly _publicName: string;
  private readonly _description: string;
  constructor(descriptor: IFormModelDescriptor) {
    this._rows = descriptor.rows.map((rowDesc) => FormRowModel.deserialize(rowDesc));
    this._id = descriptor.id;
    this._publicName = descriptor.publicName;
    this._description = descriptor.description || '';
  }

  getRows(options: IGetRowOptions = {}): (FormInputRowModel | FormCalculatedRowModel)[] {
    const { type = 'all' } = options;

    if (type === 'all') {
      return this._rows;
    }

    return this._rows.filter((row) => row.getType() === type);
  }

  toDescriptor(): IFormModelDescriptor {
    return {
      rows: this._rows.map((row) => row.toDescriptor()),
      id: this._id,
      publicName: this._publicName,
      description: this._description
    };
  }

  getId(): string {
    return this._id;
  }

  getPublicName(): string {
    return this._publicName;
  }

  getDescription(): string {
    return this._description;
  }

  static serialize(form: FormModel): IFormModelDescriptor {
    return form.toDescriptor();
  }

  static deserialize(descriptor: IFormModelDescriptor): FormModel {
    return new FormModel(descriptor);
  }
}
