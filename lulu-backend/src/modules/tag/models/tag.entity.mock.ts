import { Tag } from './tag.entity';

export const createTagMock = (overrides?: Partial<Tag>): Tag => {
  const tag = new Tag();
  tag.id = overrides?.id ?? '123e4567-e89b-12d3-a456-426614174000';
  tag.name = overrides?.name ?? 'automação';
  tag.createdAt = overrides?.createdAt ?? new Date('2024-01-01T00:00:00Z');
  tag.updatedAt = overrides?.updatedAt ?? new Date('2024-01-01T00:00:00Z');
  Object.assign(tag, overrides);
  return tag;
};
