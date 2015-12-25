describe('testing Map constructor', function() {

   var m = new Map();

   afterEach(function() {
      m.clear();
   });

   it('New Map constructor should be empty', function() {
      expect(m.size()).toEqual(0);
      expect(m.isEmpty()).toBe(true);
      expect(m.keys()).toEqual([]);
      expect(m.values()).toEqual([]);
   });

   it('put method should work as expected', function() {
      m.put("key1", {
         id: "id1"
      });
      expect(m.isEmpty()).toBe(false);
      expect(m.size()).toEqual(1);
      expect(m.keys()).toEqual(["key1"]);
      expect(m.values()).toEqual([{
         id: "id1"
      }]);

      m.put("key1", {
         id: "id1"
      });
      expect(m.isEmpty()).toBe(false);
      expect(m.size()).toEqual(1);
      expect(m.keys()).toEqual(["key1"]);
      expect(m.values()).toEqual([{
         id: "id1"
      }]);

      m.put("key2", {
         id: "id2"
      }).put("key3", ["val3"]);
      expect(m.isEmpty()).toBe(false);
      expect(m.size()).toEqual(3);
      expect(m.keys()).toEqual(["key1", "key2", "key3"]);
      expect(m.values()).toEqual([{
         id: "id1"
      }, {
         id: "id2"
      }, ["val3"]]);
   });

   it('remove method should work as expected', function() {
      m.put("key1", {
         id: "id1"
      }).put("key2", {
         id: "id2"
      }).put("key3", ["val3"]);

      expect(m.isEmpty()).toBe(false);
      expect(m.size()).toEqual(3);
      expect(m.keys()).toEqual(["key1", "key2", "key3"]);
      expect(m.values()).toEqual([{
         id: "id1"
      }, {
         id: "id2"
      }, ["val3"]]);

      var result = m.remove("key2");
      expect(result).toBe(true);
      expect(m.isEmpty()).toBe(false);
      expect(m.size()).toEqual(2);
      expect(m.keys()).toEqual(["key1", "key3"]);
      expect(m.values()).toEqual([{
         id: "id1"
      }, ["val3"]]);

      result = m.remove("key2");
      expect(result).toBe(false);
      expect(m.isEmpty()).toBe(false);
      expect(m.size()).toEqual(2);
      expect(m.keys()).toEqual(["key1", "key3"]);
      expect(m.values()).toEqual([{
         id: "id1"
      }, ["val3"]]);

      result = m.remove("key1");
      expect(result).toBe(true);
      expect(m.isEmpty()).toBe(false);
      expect(m.size()).toEqual(1);
      expect(m.keys()).toEqual(["key3"]);
      expect(m.values()).toEqual([["val3"]]);

      result = m.remove("key3");
      expect(result).toBe(true);
      expect(m.isEmpty()).toBe(true);
      expect(m.size()).toEqual(0);
      expect(m.keys()).toEqual([]);
      expect(m.values()).toEqual([]);

      result = m.remove("key3");
      expect(result).toBe(false);
      expect(m.isEmpty()).toBe(true);
      expect(m.size()).toEqual(0);
      expect(m.keys()).toEqual([]);
      expect(m.values()).toEqual([]);
   });

   it('entries method should work as expected', function() {
      m.put("key1", {
         id: "id1"
      }).put("key2", {
         id: "id2"
      }).put("key3", ["val3"]).put("key4", 2016).put("key5", true);

      var entries = m.entries();
      expect(entries instanceof Array).toBe(true);
      expect(entries.length).toEqual(5);
      expect(entries).toContain({
               key: "key2",
               value: {
                  id: "id2"
               }
      });
      expect(entries).not.toContain({
               key: "key7",
               value: null
      });

      expect(entries[0]).toEqual({
               key: "key1",
               value: {
                  id: "id1"
               }
      });
      expect(entries[1]).toEqual({
               key: "key2",
               value: {
                  id: "id2"
               }
      });
      expect(entries[2]).toEqual({
               key: "key3",
               value: ["val3"]
      });
      expect(entries[3]).toEqual({
               key: "key4",
               value: 2016
      });
      expect(entries[4]).toEqual({
               key: "key5",
               value: true
      });
   });

   it('equals method should work as expected', function() {
      m.put("key1", {
         id: "id1"
      }).put("key2", {
         id: "id2"
      }).put("key3", ["val3"]).put("key4", 2016).put("key5", true);

      var n = new Map();
      n.put("key1", {
         id: "id1"
      }).put("key2", {
         id: "id2"
      }).put("key3", ["val3"]).put("key4", 2016).put("key5", true);

      var o = new Map();
      o.put("key1", {
         id: "id1"
      }).put("key2", {
         id: "id2"
      }).put("key3", ["val3"]).put("key4", 2016).put("key5", true);

      var q = new Map();
      q.put("key1", {
         id: "id1"
      }).put("key2", {
         id: "id2"
      }).put("key3", ["val3"]).put("key4", 2016).put("key9", true);
      
      var p = new Map();
      p.put("key1", {
         id: "id1"
      }).put("key2", {
         id: "id2"
      }).put("key3", ["val3"]).put("key4", 2016).put("key5", true).put("key6", "this is a string");

      expect(m.equals(null)).toBe(false);
      expect(m.equals(undefined)).toBe(false);
      expect(m.equals({})).toBe(false);
      expect(m.equals(n)).toBe(true);
      expect(n.equals(m)).toBe(true);
      expect(m.equals(o)).toBe(true);
      expect(n.equals(o)).toBe(true);
      expect(m.equals(p)).toBe(false);
      expect(m.equals(q)).toBe(false);
   });
});