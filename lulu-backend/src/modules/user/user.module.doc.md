📂 Folder and File Structure
1. controller/
Responsible for routing and API exposure.

*.controller.ts: Defines endpoints and orchestrates service calls.

*.controller.doc.ts: Contains all Swagger decorators (@ApiOperation, @ApiResponse). Keeps the controller clean.

*.controller.spec.ts: Unit tests for the controller using service mocks.

2. models/
Defines the module's data structure.

dto/: Contains Data Transfer Objects for input validation (class-validator) and property documentation.

entity/: Defines the database entity (TypeORM).

*.mock.ts: Object factories (DTOs or Entities) for testing, ensuring consistent data.

3. repository/
Data access and persistence layer.

*.repository.ts: Implements database logic (SQL, QueryBuilder). Extends BaseRepository.

*.repository.interface.ts: Defines the contract (methods) the repository must implement.

*.repository.mock.ts: Factory that returns a jest.Mocked version of the repository to isolate service tests.

*.repository.spec.ts: Integration or unit tests for the persistence layer.

4. service/
Contains core business logic.

*.service.ts: Implements business rules and utilizes repositories.

*.service.interface.ts: Interface defining service methods, enabling dependency inversion.

*.service.mock.ts: Mock factory so other modules can test their dependencies without calling the real service.

📜 Golden Rules (Mandatory Standard)
Documentation Decoupling: It is forbidden to place @ApiResponse or schema decorators directly in the Controller. Always use the .doc.ts file with applyDecorators.

Use of Interfaces: Every Service and Repository must have an interface. Dependency injection should prefer interface tokens to facilitate mock substitution.

Zero any: The use of any is strictly prohibited. 

Mocks via Factory: Mocks must not be global constant objects. They must be created via create...Mock() functions, ensuring clean instances (jest.fn()) for every test.

Unused Variables: Variables required by contract but not used in logic must be prefixed with _ (e.g., _userId) to satisfy the linter.

Password Security: The password field in the entity must have select: false. If you need to manually remove it from an object, use destructuring: const { password: _, ...userWithoutPass } = user.