import { getGraphQLClient } from './client';

/**
 * Configuration for the generic GraphQL relation handler.
 * @template T - The type of the existing data items.
 */
interface RelationHandlerConfig<T> {
  // The table name in the database (e.g., "profile_skills").
  tableName: string;

  // The column name for the parent's ID (e.g., "profile_id").
  parentIdColumn: string;

  // The column name for the related item's ID (e.g., "skill_id").
  relationIdColumn: string;

  // The field in an existing data item that holds the relation ID.
  existingIdField: keyof T;
}

/**
 * Handles the update of a many-to-many relationship using GraphQL.
 * It calculates the differences between the new and existing data
 * and performs the necessary insert and delete mutations.
 *
 * @template T - The type of the existing data items.
 * @param parentId - The ID of the parent entity.
 * @param newData - An array of IDs for the new relations.
 * @param existingData - An array of existing relation objects.
 * @param config - The configuration for the handler.
 */
export async function graphqlRelationHandler<T>(
  parentId: string,
  newData: (string | number)[],
  existingData: T[],
  config: RelationHandlerConfig<T>,
) {
  const client = getGraphQLClient();

  const existingIds = new Set(existingData.map(item => item[config.existingIdField]));
  const newIds = new Set(newData);

  const toDelete = Array.from(existingIds).filter(id => !newIds.has(id));
  const toAdd = Array.from(newIds).filter(id => !existingIds.has(id));

  const collectionName = `${config.tableName}Collection`;

  // --- Deletion ---
  if (toDelete.length > 0) {
    // Supabase GraphQL API expects separate mutations for each deletion.
    const deletePromises = toDelete.map(id => {
      const mutation = `
        mutation Delete($filter: ${config.tableName}Filter!) {
          deleteFrom${collectionName}(filter: $filter) {
            affectedCount
          }
        }
      `;
      const filter = {
        [config.parentIdColumn]: { eq: parentId },
        [config.relationIdColumn]: { eq: id },
      };
      return client.executeMutation(mutation, { filter });
    });
    await Promise.all(deletePromises);
  }

  // --- Insertion ---
  if (toAdd.length > 0) {
    const mutation = `
      mutation Insert($objects: [${config.tableName}InsertInput!]!) {
        insertInto${collectionName}(objects: $objects) {
          affectedCount
        }
      }
    `;
    const objects = toAdd.map(id => ({
      [config.parentIdColumn]: parentId,
      [config.relationIdColumn]: id,
    }));
    await client.executeMutation(mutation, { objects });
  }
}
